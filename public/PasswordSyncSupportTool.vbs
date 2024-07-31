' Copyright 2012 Google Inc. All Rights Reserved.
'
' Licensed under the Apache License, Version 2.0 (the "License");
' you may not use this file except in compliance with the License.
' You may obtain a copy of the License at
'
'     http://www.apache.org/licenses/LICENSE-2.0
'
' Unless required by applicable law or agreed to in writing, software
' distributed under the License is distributed on an "AS IS" BASIS,
' WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
' See the License for the specific language governing permissions and
' limitations under the License.

' Password Sync diagnostics tool
' Liron Newman lironn@google.com

' Do not change this line's format, build.bat relies on it.
Const Ver = "2.0.3.0"

Const ToolName = "PasswordSyncSupportTool"

Dim fso, objShell, objShellApplication, CurrentComputerName
Set fso = WScript.CreateObject("Scripting.FileSystemObject")
Set objShell = WScript.CreateObject("Wscript.Shell")
Set objShellApplication = CreateObject("Shell.Application")
Const ForReading = 1, ForWriting = 2, ForAppending = 8
Const WshRunning = 0, WshFinished = 1, WshFailed = 2

' Check if the /ELEVATED parameter was provided, meaning that the script
' re-invoked itself with elevation ("run as admin").
Dim ParameterProvided
ParameterProvided = False
' In VBScript, this check needs to be in a separate condition to prevent an
' "index out of bounds" error.
If WScript.Arguments.Count > 0 Then
  If UCase(WScript.Arguments(0)) = "/ELEVATED" Or _
     UCase(WScript.Arguments(0)) = "/DC" Then
    ParameterProvided = True
  End If
End If

' If not running via CScript.exe we always need to re-invoke, but also if we
' weren't already re-invoked (ParameterProvided = False).
If Not (UCase(Right(WScript.FullName, 12)) = "\CSCRIPT.EXE" And _
    ParameterProvided) Then
  objShellApplication.ShellExecute _
      "cmd.exe", _
      "/c title " & ToolName & " & cscript.exe //nologo """ & _
          WScript.ScriptFullName & """ /ELEVATED", _
      "", _
      "runas", _
      1
  WScript.Quit
End If

On Error Resume Next  ' Errors will be handled by the code

Dim LogFileName, TempDir, CurrentTimeString
CurrentTimeString = GetCurrentTimeString
TempDir = objShell.ExpandEnvironmentStrings("%temp%\" & ToolName)
' We can assume %userdnsdomain% is the computer's DNS domain too, because we
' will enforce it in CheckComputerAndUserDetails().
CurrentComputerName = _
    UCase(objShell.ExpandEnvironmentStrings("%computername%.%userdnsdomain%"))
LogFileName = TempDir & "\" & ToolName & ".log"
' Check if this instance was executed to diagnose a DC
If WScript.Arguments.Count > 0 Then
  ' Note that this will break commandline arguments if we plan to use them in
  ' the future
  If UCase(WScript.Arguments(0)) = "/DC" Then
    RunDiagnostics WScript.Arguments(1)
    WScript.Quit
  End If
End If

' Delete old temporary folder
fso.DeleteFolder TempDir, True

' Create new temporary folder
fso.CreateFolder TempDir

LogStr "A:Starting " & ToolName & " version " & Ver & " from " & _
       WScript.ScriptFullName

' Check whether the current user is a Domain Admin and other machine/user
' settings.
If Not CheckComputerAndUserDetails Then WScript.Quit
If Not CheckIfRunningAsDomainAdmin Then WScript.Quit


' Get list of writable DCs
Dim arrWritableDCs
arrWritableDCs = GetWritableDCs
LogStr "A:Got " & UBound(arrWritableDCs) + 1 & " writable DCs"
' Instanciate additional arrays
Dim arrExec()  ' For Exec objects
ReDim arrExec(UBound(arrWritableDCs))
Dim arrBuffers()  ' For StdOut buffers
ReDim arrBuffers(UBound(arrWritableDCs))
Dim arrOutFiles()  ' For StdOut buffers
ReDim arrOutFiles(UBound(arrWritableDCs))
For i = 0 To UBound(arrWritableDCs)
  If arrWritableDCs(i) <> "" Then
    ' Create folder for results
    LogStr "A:Creating " & TempDir & "\" & arrWritableDCs(i)
    fso.CreateFolder TempDir & "\" & arrWritableDCs(i)
    LogErrorIfNeeded "Error creating folder"
    ' Call this script with DC name
    LogStr "A:Starting job for " & arrWritableDCs(i)
    ' We need to redirect both stdout and stderr to a file instead of catching
    ' them directly with the StdOut/StdEr objects, because reading from these
    ' streams is blocking, and we want to do it concurrently.
    Set arrExec(i) = objShell.Exec( _
        "cmd /c cscript //NoLogo """ & WScript.ScriptFullName & """ /DC " & _
        arrWritableDCs(i) & " 1>" & TempDir & "\" & arrWritableDCs(i) & _
        ".txt 2>&1 ")
    LogErrorIfNeeded "Error starting job"
    WScript.Sleep 100
    ' Open the output file.
    Set arrOutFiles(i) = _
        fso.OpenTextFile(TempDir & "\" & arrWritableDCs(i) & ".txt", _
                         ForReading, _
                         0)
    LogErrorIfNeeded "Error opening job output file"
  Else
    LogStr "W:Skipping empty DC name"
  End If
Next

' Process output from all instances until they're all gone
Dim NumCompleted
NumCompleted = 0
While NumCompleted <= UBound(arrWritableDCs)
  WScript.Sleep 10
  For i = 0 To UBound(arrWritableDCs)
    ' We set completed Execs to Null, so we can skip them.
    If Not IsNull(arrExec(i)) Then
      arrBuffers(i) = arrBuffers(i) & arrOutFiles(i).Read(1)
      Err.Clear  ' Ignore "Input past end of file" errors
      ' TODO: Improve logging here - some text files aren't being read on
      ' domains with many DCs.
      ' As long as we have full lines...
      While InStr(arrBuffers(i), vbNewLine) > 0
        If InStr(arrBuffers(i), vbNewLine) > 1 Then
          LogStr "A:Job " & arrWritableDCs(i) & ": " & _
                 Left(arrBuffers(i), InStr(arrBuffers(i), vbNewLine) - 1)
        End If
        arrBuffers(i) = Mid(arrBuffers(i), _
                            InStr(arrBuffers(i), vbNewLine) + 2, _
                            Len(arrBuffers(i)))
      Wend

      If arrExec(i).Status <> WshRunning Then
        ' Write any leftover data
        arrBuffers(i) = arrBuffers(i) & arrOutFiles(i).ReadAll
        Err.Clear  ' Ignore reading errors
        If Len(arrBuffers(i)) > 0 Then
          Dim arrTemp
          arrTemp = Split(arrBuffers(i), vbNewLine)
          For j = 0 To UBound(arrTemp)
            If Len(arrTemp(j)) > 0 Then
              LogStr "A:Job " & arrWritableDCs(i) & ": " & arrTemp(j)
            End If
          Next  ' j
        End If
        ' Close file we no longer need
        arrOutFiles(i).Close
        ' Log status
        If arrExec(i).Status = WshFailed Then
          LogStr "E:Job " & arrWritableDCs(i) & " failed with exit code " & _
                 arrExec(i).ExitCode
        ElseIf arrExec(i).Status = WshFinished Then
          LogStr "A:Job " & arrWritableDCs(i) & _
                 " finished successfully with exit code " & arrExec(i).ExitCode
        End If
        NumCompleted = NumCompleted + 1
        arrExec(i) = Null
      End If
    End If
  Next  ' i
Wend

LogStr "A:Finished collecting information, creating ZIP"

' Rename folder to include timestamp, for uniqueness
Dim NewFolderName
NewFolderName = TempDir & "_" & CurrentTimeString
fso.MoveFolder TempDir, NewFolderName

' Create ZIP with reports
Dim ZipName
ZipName = ToolName & "-report_" & CurrentTimeString & ".zip"
CompressFolder objShell.SpecialFolders("Desktop") & "\" & ZipName, NewFolderName
Message = "Please send the file """ & ZipName & _
          """ from your Desktop to Google Support for investigation."
WScript.Echo VbNewLine & Message
MsgBox Message, vbOKOnly, ToolName

WScript.Echo "Press Enter to close this window"
WScript.StdIn.Read(1)

Function GetCurrentTimeString()
  GetCurrentTimeString = _
      Year(Now) & Right("0" & Month(Now), 2) & Right("0" & Day(Now), 2) & _
      "_" & _
      Right("0" & Hour(Now), 2) & Right("0" & Minute(Now), 2) & _
      Right("0" & Second(Now), 2)
End Function

Sub LogStr(str)
  Dim LogFile  ' As Stream
  Set LogFile = fso.OpenTextFile(LogFileName, ForAppending, True)
  ' TODO: Prettier date/time with DatePart(), and add timezone from http://social.technet.microsoft.com/Forums/en-US/ITCG/thread/daf4b666-fcb6-46ad-becc-689e6daf49ed
  LogFile.WriteLine Now & " " & str
  LogFile.Close
  WScript.Echo Now & " " & str
End Sub

Sub LogErr
  LogErr = "Error #" & Err & " (hex 0x" & Right("00000000" & Hex(Err), 8) & _
           "), Source: " & Err.Source & ", Description: " & Err.Description
  Err.Clear
End Sub

Sub PrintLine(Text)
  WScript.StdOut.WriteLine Text
End Sub

Sub PrintErrorIfNeeded(Text)
  If Err <> 0 Then PrintLine " E:" & Text & " " & LogErr
End Sub

Sub LogErrorIfNeeded(Text)
  If Err <> 0 Then LogStr "E:" & Text & ": " & LogErr
End Sub

Sub ErrorMsgBox(Text)
  MsgBox "Error: " & Text & vbCrLf & vbCrLf & _
             "Please share this with Google Support.", _
         vbOKOnly Or vbExclamation, _
         ToolName
End Sub

Sub RunCommand(Command, OutputFileNameBase)
  On Error Resume Next

  ' Always use bWaitOnReturn=True to make sure the subpreoccess returns after
  ' all data was collected.
  PrintLine "Running command: " & Command
  objShell.Run "cmd /c " & Command & " 1>>" & OutputFileNameBase & ".txt " & _
                   "2>>" & OutputFileNameBase & ".err", _
               0, _
               True
  PrintErrorIfNeeded "Running command '" & Command & "' failed. "
End Sub

Sub RunCopyCommand(Source, Target)
  ' Checking if we are copying from the local machine and current user.
  ' If we are, use %userprofile% which is more reliable.
  CurrentMachineAndUserPrefix2008 = _
      "\\" & CurrentComputerName & "\C$\USERS\%USERNAME%\"
  CurrentMachineAndUserPrefix2003 = _
      "\\" & CurrentComputerName & "\C$\DOCUMENTS AND SETTINGS\%USERNAME%\"
  If UCase(Left(Source, Len(CurrentMachineAndUserPrefix2008))) = _
      CurrentMachineAndUserPrefix2008 Then
    Source = "%userprofile%" & _
             Mid(Source, Len(CurrentMachineAndUserPrefix2008))
  ElseIf UCase(Left(Source, Len(CurrentMachineAndUserPrefix2003))) = _
      CurrentMachineAndUserPrefix2003 Then
    Source = "%userprofile%" & _
             Mid(Source, Len(CurrentMachineAndUserPrefix2003))
  End If

  RunCommand _
      "xcopy """ & Source & """ """ & Target & """ " & "/C /E /F /H /Y /I /G", _
      "copying"
End Sub

Sub DecodeWinHTTPSettings(CompName, OutputFileName)
  On Error Resume Next

  LogLinePrefix = "Current WinHTTP proxy settings:" & vbCRLF & vbCRLF
  ' Create a WMI StdRegProv.
  Dim objStdRegProv
  Set objStdRegProv = GetObject( _
      "winmgmts:{impersonationLevel=impersonate}!\\" & CompName & _
      "\root\default:StdRegProv")
  PrintErrorIfNeeded "Error opening WMI StdRegProv on " & CompName & ": "
  ' Retrieve the value of WinHTTPSettings from the registry.
  ' Note that GetBinaryValue returns an array, where each element in the array
  ' is a DECIMAL value of the octets.
  Dim WinHTTPSettingsArray
  Const HKEY_LOCAL_MACHINE = &H80000002  ' From https://msdn.microsoft.com/en-us/library/aa394600(v=vs.85).aspx?cs-lang=vb
  objStdRegProv.GetBinaryValue HKEY_LOCAL_MACHINE, _
                               "SOFTWARE\Microsoft\Windows\CurrentVersion\" & _
                                   "Internet Settings\Connections", _
                               "WinHttpSettings", _
                               WinHTTPSettingsArray
  PrintErrorIfNeeded _
      "Error retrieving HKLM\SOFTWARE\Microsoft\Windows\" & _
      "CurrentVersion\Internet Settings\Connections\WinHttpSettings on " & _
      CompName & ": "
  ' The WinHttpSettings registry value appears to be formatted as follows:
  '   Length : Description
  '       12 : ?
  '        1 : Length of proxy string.
  '        3 : ?
  '        ~ : Proxy string; variable length.
  '        1 : Length of bypass list string.
  '        3 : ?
  '        ~ : Bypass list string; variable length.
  ' Based on https://p0w3rsh3ll.wordpress.com/2012/10/07/getsetclear-proxy/.
  ' Start by getting the proxy string length.
  Dim WinHTTPProxyLength
  WinHTTPProxyLength = WinHTTPSettingsArray(12)
  ' Prepare the output file.
  Dim WinHTTPParsedFile
  Set WinHTTPParsedFile = fso.OpenTextFile(OutputFileName, ForAppending, True)
  PrintErrorIfNeeded "Error opening " & OutputFileName
  ' If the proxy string length is greater than 0, a proxy is set. If not, the
  ' connection is direct.
  If WinHTTPProxyLength > 0 Then
    Dim WinHTTPProxy, WinHTTPBypassList, WinHTTPBypassListLength
    ' Concatenate the proxy, starting from 16, through the proxy length.
    For Index = 16 To (16 + WinHTTPProxyLength - 1)
      WinHTTPProxy = WinHTTPProxy & ChrW(WinHTTPSettingsArray(Index))
    Next
    ' Get the bypass list string length. We know its position is 12 + 1 + 3 +
    ' the length of the proxy string.
    WinHTTPBypassListLength = WinHTTPSettingsArray((16 + WinHTTPProxyLength))
    ' If the length of the list is greater than 0, concatenate it.
    If WinHTTPBypassListLength > 0 Then
      ' Start from 12 + 1 + 3 + proxy string length + 1 + 3.
      For Index = (20 + WinHTTPProxyLength) To _
          (20 + WinHTTPProxyLength + WinHTTPBypassListLength - 1)
        WinHTTPBypassList = WinHTTPBypassList & _
                            ChrW(WinHTTPSettingsArray(Index))
      Next
    Else
      WinHTTPBypassList = "(none)"
    End If
    PrintErrorIfNeeded "Error decoding WinHttpSettings on " & CompName & ": "
    WinHTTPParsedFile.WriteLine LogLinePrefix & _
        "    Proxy Server(s) :  " & WinHTTPProxy & vbCRLF & _
        "    Bypass List     :  " & WinHTTPBypassList
  Else
    WinHTTPParsedFile.WriteLine LogLinePrefix & _
        "    Direct access (no proxy server)."
  End If
  PrintErrorIfNeeded "Error writing to " & OutputFileName
  WinHTTPParsedFile.Close
End Sub

' Run diagnostics on remote machines
Sub RunDiagnostics(CompName)
  On Error Resume Next

  PrintLine "Starting diagnostics on " & CompName
  objShell.CurrentDirectory = TempDir & "\" & CompName  ' Change current dir
  PrintErrorIfNeeded "Error changing to work folder for this DC file: "

  PrintLine "Getting Notification Package DLL reg entry - dll-reg.txt"
  RunCommand "reg query \\" & CompName & _
                 "\HKLM\SYSTEM\CurrentControlSet\Control\Lsa " & _
                 "/v ""Notification Packages""", _
             "dll-reg"

  PrintLine "Running tasklist.exe to see if the DLL is loaded - dll-loaded.txt"
  RunCommand "tasklist /S " & CompName & " /m password_sync_dll.dll", _
             "dll-loaded"

  PrintLine "Getting service status - service_*.txt"
  RunCommand "(sc \\" & CompName & " query ""Google Apps Password Sync"" && " & _
                 "sc \\" & CompName & " qc ""Google Apps Password Sync"")", _
             "service_gaps"
  RunCommand "(sc \\" & CompName & " query ""G Suite Password Sync"" && " & _
                 "sc \\" & CompName & " qc ""G Suite Password Sync"")", _
             "service_gsps"
  RunCommand "(sc \\" & CompName & " query ""Password Sync"" && " & _
                 "sc \\" & CompName & " qc ""Password Sync"")", _
             "service_password_sync"

  ' Get logs (from default locations - v1) using XCOPY to get the full tree
  ' Assume the username is the same as the current username for the UI logs.
  ' It doesn't matter for the other paths (they don't depend on the username).
  PrintLine "Copying logs and XML - copying.txt"

  ' C:\Users\username\AppData\Local\Google\Google Apps Password Sync\Tracing
  RunCopyCommand "\\" & CompName & "\c$\Users\%username%\AppData\Local\Google\Google Apps Password Sync\Tracing", _
                 "UI"

  ' C:\Documents and Settings\username\Local Settings\Application Data\Google\Google Apps Password Sync\Tracing
  RunCopyCommand "\\" & CompName & "\c$\Documents and Settings\%username%\Local Settings\Application Data\Google\Google Apps Password Sync\Tracing", _
                 "UI"

  ' C:\Users\username\AppData\Local\Google\Identity
  RunCopyCommand "\\" & CompName & "\c$\Users\%username%\AppData\Local\Google\Identity", _
                 "Identity"

  ' C:\Documents and Settings\username\Local Settings\Application Data\Google\Identity
  RunCopyCommand "\\" & CompName & "\c$\Documents and Settings\username\Local Settings\Application Data\Google\Identity", _
                 "Identity"

  ' C:\Windows\ServiceProfiles\NetworkService\AppData\Local\Google\Google Apps Password Sync\Tracing\password_sync_service
  RunCopyCommand "\\" & CompName & "\c$\Windows\ServiceProfiles\NetworkService\AppData\Local\Google\Google Apps Password Sync\Tracing\password_sync_service", _
                 "Service"

  'C:\Documents and Settings\NetworkService\Local Settings\Application Data\Google\Google Apps Password Sync\Tracing\password_sync_service
  RunCopyCommand "\\" & CompName & "\c$\Documents and Settings\NetworkService\Local Settings\Application Data\Google\Google Apps Password Sync\Tracing\password_sync_service", _
                 "Service"

  ' C:\Windows\ServiceProfiles\NetworkService\AppData\Local\Google\Identity
  RunCopyCommand "\\" & CompName & "\c$\Windows\ServiceProfiles\NetworkService\AppData\Local\Google\Identity", _
                 "ServiceAuth"

  'C:\Documents and Settings\NetworkService\Local Settings\Application Data\Google\Identity
  RunCopyCommand "\\" & CompName & "\c$\Documents and Settings\NetworkService\Local Settings\Application Data\Google\Identity", _
                 "ServiceAuth"

  ' C:\WINDOWS\system32\config\systemprofile\AppData\Local\Google\Google Apps Password Sync\Tracing\lsass
  RunCopyCommand "\\" & CompName & "\c$\WINDOWS\system32\config\systemprofile\AppData\Local\Google\Google Apps Password Sync\Tracing\lsass", _
                 "DLL"

  'C:\WINDOWS\system32\config\systemprofile\Local Settings\Application Data\Google\Google Apps Password Sync\Tracing\lsass
  RunCopyCommand "\\" & CompName & "\c$\WINDOWS\system32\config\systemprofile\Local Settings\Application Data\Google\Google Apps Password Sync\Tracing\lsass", _
                 "DLL"

  ' C:\ProgramData\Google\Google Apps Password Sync\config.xml
  RunCopyCommand "\\" & CompName & "\c$\ProgramData\Google\Google Apps Password Sync\config.xml", _
                 "."

  ' C:\Documents and Settings\All Users\Application Data\Google\Google Apps Password Sync\config.xml
  RunCopyCommand "\\" & CompName & "\c$\Documents and Settings\All Users\Application Data\Google\Google Apps Password Sync\config.xml", _
                 "."

  ' Get install path for Password Sync (x86 indicates that the x86 version was
  ' installed on x64 - won't work). Just search for the files in both possible
  ' paths.
  PrintLine "Getting list of installed files - install.txt and instx86.txt"
  RunCommand "dir ""\\" & CompName & "\c$\Program Files\Google\Google Apps Password Sync"" /B /S", _
             "install"
  RunCommand "dir ""\\" & CompName & "\c$\Program Files\Google\G Suite Password Sync"" /B /S", _
             "install"
  RunCommand "dir ""\\" & CompName & "\c$\Program Files\Google\Password Sync"" /B /S", _
             "install"
  RunCommand "dir ""\\" & CompName & "\c$\Program Files (x86)\Google\Google Apps Password Sync"" /B /S", _
             "instx86"
  RunCommand "dir ""\\" & CompName & "\c$\Program Files (x86)\Google\G Suite Password Sync"" /B /S", _
             "instx86"
  RunCommand "dir ""\\" & CompName & "\c$\Program Files (x86)\Google\Password Sync"" /B /S", _
             "instx86"

  PrintLine "Getting system-wide proxy settings dump from registry - proxy.txt"
  RunCommand "reg query ""\\" & CompName & "\HKLM\SOFTWARE\Policies\Microsoft\Windows\CurrentVersion\Internet Settings"" /v ProxySettingsPerUser", _
             "proxy"

  PrintLine "Getting system-wide WinHTTP settings dump from registry - winhttp.txt"
  RunCommand "reg query ""\\" & CompName & "\HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings\Connections"" /v WinHttpSettings", _
             "winhttp"

  PrintLine "Getting admin email address and service account address (if applicable)"
  RunCommand "reg query ""\\" & CompName & "\HKLM\SOFTWARE\Google\Google Apps Password Sync"" /v Email", _
             "admin-and-serviceaccount-emails"
  RunCommand "reg query ""\\" & CompName & "\HKLM\SOFTWARE\Google\Google Apps Password Sync"" /v ServiceAccountEmail", _
             "admin-and-serviceaccount-emails"

  ' https://docs.microsoft.com/en-us/windows-server/security/tls/tls-registry-settings
  ' This is useful for understanding errors such as WINHTTP_CALLBACK_STATUS_FLAG_SECURITY_CHANNEL_ERROR
  PrintLine "Getting TLS registry settings"
  RunCommand "reg query ""\\" & CompName & "\HKLM\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL"" /s", _
             "tls-registry-settings"

  PrintLine "Getting system-wide WinHTTP settings dump from registry, and decoding - winhttp_decoded.txt"
  DecodeWinHTTPSettings CompName, "winhttp_decoded.txt"

  ' Get remote system time using http://blogs.technet.com/b/heyscriptingguy/archive/2007/03/08/how-can-i-verify-the-system-time-on-a-remote-computer.aspx,
  ' and last boot time using https://gallery.technet.microsoft.com/ScriptCenter/82588289-4e07-455e-8322-c635cc719f00/
  PrintLine "Getting local time and last boot time from remote machine"
  Set objWMIService = GetObject("winmgmts:\\" & CompName & "\root\cimv2")
  PrintErrorIfNeeded "Error opening WMI on " & CompName & ": "

  Set colItems = objWMIService.ExecQuery("SELECT * FROM Win32_OperatingSystem")
  PrintErrorIfNeeded "Error querying Win32_OperatingSystem. "

  For Each objItem in colItems
    strTimeZone = (objItem.CurrentTimeZone / 60)
    If objItem.CurrentTimeZone >= 0 Then
      strTimeZone = "+" & strTimeZone
    End If
    WScript.Echo "Local Time: " & WMIDateStringToTime(objItem.LocalDateTime) & _
                 ", Time Zone: " & strTimeZone
    WScript.Echo "Last boot time: " & _
                 WMIDateStringToTime(objItem.LastBootUpTime)
  Next
  PrintErrorIfNeeded "Error printing time: "
  Err.Clear

  ' Get file versions using https://blogs.technet.microsoft.com/heyscriptingguy/2005/04/18/how-can-i-determine-the-version-number-of-a-file/
  PrintLine "Getting versions of important executables"
  Set colFiles = objWMIService.ExecQuery( _
      "SELECT Name, Version FROM CIM_Datafile WHERE " & _
      "Name = 'c:\\Windows\\System32\\lsass.exe' OR " & _
      "Name = 'c:\\Windows\\System32\\password_sync_dll.dll' OR " & _
      "Name = 'c:\\Program Files\\Google\\Google Apps Password Sync\\GoogleAppsPasswordSync.exe' OR " & _
      "Name = 'c:\\Program Files\\Google\\Google Apps Password Sync\\password_sync_service.exe' OR " & _
      "Name = 'c:\\Program Files\\Google\\Google Apps Password Sync\\unifiedlogin.dll' OR " & _
      "Name = 'c:\\Program Files\\Google\\Password Sync\\PasswordSync.exe' OR " & _
      "Name = 'c:\\Program Files\\Google\\Password Sync\\password_sync_service.exe' OR " & _
      "Name = 'c:\\Program Files\\Google\\Password Sync\\unifiedlogin.dll' OR " & _
      "Name = 'c:\\Program Files\\Google\\G Suite Password Sync\\PasswordSync.exe' OR " & _
      "Name = 'c:\\Program Files\\Google\\G Suite Password Sync\\password_sync_service.exe' OR " & _
      "Name = 'c:\\Program Files\\Google\\G Suite Password Sync\\unifiedlogin.dll'")
  PrintErrorIfNeeded "Error querying CIM_Datafile. "
  For Each objFile in colFiles
    Wscript.Echo "[" & objFile.Name & "] " & objFile.Version
  Next
  PrintErrorIfNeeded "Error printing files and versions: "

  PrintLine "Finished diagnostics on " & CompName
End Sub

Function WMIDateStringToTime(strDate)
  On Error Resume Next
  If Len(strDate) < 15 Then
    WMIDateStringToTime = "**Can't parse WMI time string " & strDate & "**"
  Else
    WMIDateStringToTime = Left(strDate, 4) & "-" & _
                          Mid(strDate, 5, 2) & "-" & _
                          Mid(strDate, 7, 2) & " " & _
                          Mid (strDate, 9, 2) & ":" & _
                          Mid(strDate, 11, 2) & ":" & _
                          Mid(strDate, 13, 2)
  End If
  PrintErrorIfNeeded "Error converting WMI time: "
End Function

' Returns array of writable DCs' DNS names
Function GetWritableDCs()
  On Error Resume Next

  ' Initialize ADSI ADO provider. This is used because we need to make a
  ' subtree-scope query.
  Set conn = CreateObject("ADODB.Connection")
  conn.Provider = "ADSDSOObject"
  conn.Open "ADs Provider"
  LogErrorIfNeeded "Error opening ADSI ADO provider"

  QueryBase = _
      "<LDAP://" & GetObject("LDAP://RootDSE").Get("defaultNamingContext") & ">;"
  ' Query for computer accounts where userAccountControl has
  ' SERVER_TRUST_ACCOUNT bit set, meaning it's a DC, and not msDS-IsRodc=true,
  ' meaning it isn't an RODC. See http://support.microsoft.com/kb/305144 for
  ' reference.
  Query = QueryBase & _
          "(&(objectCategory=computer)" & _
          "(userAccountControl:1.2.840.113556.1.4.803:=8192)" & _
          "(!(msDS-IsRodc=true)));" & _
          "dNSHostName;subtree"

  LogStr "A:Getting list of writable DCs: " & Query
  Set rs = conn.Execute(Query)
  LogErrorIfNeeded "Error executing query"

  If rs.EOF Then
    LogStr "W:No DCs found - maybe msDS-IsRodc is missing from the schema " & _
           "(Windows 2003)? Trying without it."
    Query = QueryBase & _
            "(&(objectCategory=computer)" & _
            "(userAccountControl:1.2.840.113556.1.4.803:=8192));" & _
            "dNSHostName;subtree"

    LogStr "A:Getting list of all DCs: " & Query
    Set rs = conn.Execute(Query)
    LogErrorIfNeeded "Error executing query"

  End If

  Dim DCs(), DCCount
  DCCount = 0
  While Not rs.EOF
    LogStr "A:Found " & rs.Fields(0).Value
    ReDim Preserve DCs(DCCount)
    DCs(DCCount) = rs.Fields(0).Value
    LogErrorIfNeeded "Error getting DC name"
    rs.MoveNext
    DCCount = DCCount + 1
  Wend
  GetWritableDCs = DCs
End Function

' This function is based on the sample from
' http://www.vbsedit.com/scripts/desktop/info/scr_231.asp
Function CheckComputerAndUserDetails()
  On Error Resume Next

  Set objWMIService = GetObject("winmgmts:\\.\root\CIMV2")
  LogErrorIfNeeded "Getting WMI service object for computer details"
  Set colItems = objWMIService.ExecQuery("SELECT * FROM Win32_ComputerSystem")
  LogErrorIfNeeded "Executing WMI query for computer details"
  For Each objItem In colItems
    LogStr "A:Computer Name: " & objItem.Name
    LogStr "A:Computer's Domain: " & objItem.Domain
    LogStr "A:Part Of Domain: " & objItem.PartOfDomain
    Select Case objItem.DomainRole
      Case 0 strDomainRole = "Standalone Workstation"
      Case 1 strDomainRole = "Member Workstation"
      Case 2 strDomainRole = "Standalone Server"
      Case 3 strDomainRole = "Member Server"
      Case 4 strDomainRole = "Backup Domain Controller"
      Case 5 strDomainRole = "Primary Domain Controller"
      Case Else strDomainRole = "Unknown (" & objItem.DomainRole & ")"
    End Select
    LogStr "A:Computer's Domain Role: " & strDomainRole
    LogStr "A:Computer's Roles: " & Join(objItem.Roles, ", ")

    If Not objItem.PartOfDomain Then
      LogStr "E:This machine isn't part of a domain. Exiting."
      ErrorMsgBox "This machine isn't part of a domain. Make sure you " & _
                  "are logged in as a domain admin, and run this tool again."
      CheckComputerAndUserDetails = False
      Exit Function
    End If
    UserName = objShell.ExpandEnvironmentStrings("%USERNAME%")
    LogStr "A:Current user's name: " & UserName
    UserDNSDomain = LCase(objShell.ExpandEnvironmentStrings("%USERDNSDOMAIN%"))
    If UserDNSDomain = "%userdnsdomain%" Then
      LogStr "E:The logged in user isn't a domain user. Exiting."
      ErrorMsgBox "The logged in user (" & UserName & ") isn't a domain " & _
                  "user. Make sure you are logged in as a domain admin, " & _
                  "and run this tool again."
      CheckComputerAndUserDetails = False
      Exit Function
    End If
    LogStr "A:Current user's AD DNS domain: " & UserDNSDomain
    If LCase(objItem.Domain) <> UserDNSDomain Then
      LogStr "E:The user's domain doesn't match the machine's domain. Exiting."
      ErrorMsgBox "The current user's DNS domain (" & UserDNSDomain & _
                  ") doesn't match the machine's DNS domain (" & _
                  objItem.Domain & "). This will cause Password Sync " & _
                  "to fail. Make sure you are logged in as a " & _
                  "domain admin from the same domain as the Domain " & _
                  "Controller, and try the installation again."
      CheckComputerAndUserDetails = False
      Exit Function
    End If
  Next
  CheckComputerAndUserDetails = True
End Function

' This function is based on
' http://www.aspfree.com/c/a/Windows-Scripting/Compressed-Folders-in-WSH/
Function CompressFolder(strPath, strFolder)
  On Error Resume Next

  Const adTypeBinary = 1
  Const adTypeText = 2
  Const adSaveCreateNotExist = 1
  Const adSaveCreateOverwrite = 2
  With CreateObject("ADODB.Stream")
    .Open
    LogErrorIfNeeded "Error opening ADODB for creating the ZIP file"
    .Type = adTypeText
    .WriteText ChrB(&h50) & ChrB(&h4B) & ChrB(&h5) & ChrB(&h6)
    For i = 1 To 18
      .WriteText ChrB(&h0)
    Next
    .SaveToFile strPath, adSaveCreateNotExist
    LogErrorIfNeeded "Error saving ZIP file"
    .Close
    .Open
    .Type = adTypeBinary
    .LoadFromFile strPath
    .Position = 2
    arrBytes = .Read
    .Position = 0
    .SetEOS
    .Write arrBytes
    .SaveToFile strPath, adSaveCreateOverwrite
    .Close
    LogErrorIfNeeded "Error re-saving ZIP file"
  End With
  Set objFolder = objShellApplication.NameSpace(strPath)
  LogErrorIfNeeded "Error opening ZIP file for writing"
  intCount = objFolder.Items.Count
  objFolder.CopyHere strFolder, 256
  LogErrorIfNeeded "Error copying files to ZIP file"
  Do Until objFolder.Items.Count = intCount + 1
    WScript.Sleep 200
  Loop
End Function

' All functions below either taken from or based on
' http://explodingcoder.com/blog/content/how-query-active-directory-security-group-membership
' Shawn Poulson, 2009.05.18
' explodingcoder.com

' Returns True if the current user is a Domain Admin, otherwise False
Function CheckIfRunningAsDomainAdmin()
  ' Written by Liron Newman based on Shawn Poulson's example
  ' NOTE: This function doesn't take into account the actual token's groups,
  ' meaning that if running unelevated on a system that uses UAC, the script
  ' will not be able to actually use all the user's permissions.
  On Error Resume Next

  Set oADSysInfo = CreateObject("ADSystemInfo")
  LogErrorIfNeeded "Error creating ADSystemInfo object"
  userDN = oADSysInfo.UserName  ' Get DN of user
  LogStr "A:Current user DN: " & userDN
  ' We shouldn't use the name "Domain Admins" to check membership because it
  ' may be localized, we should use the Well-Known SID.

  ' Define the Domain Admins group SID prefix and suffix in hex:
  Const DomainAdminsSIDStart = "010500000000000515000000"
  Const DomainAdminsSIDEnd = "00020000"
  ' Enumerate all member group names
  tkUser = GetTokenGroups(userDN)  ' Get tokens of member groups
  ' See if the Domain Admins group SID is in the token groups
  CheckIfRunningAsDomainAdmin = False
  For Each sid In tkUser
    Dim tmpstr
    tmpstr = ByteArrToHexString(sid)
    If (Left(tmpstr, Len(DomainAdminsSIDStart)) = DomainAdminsSIDStart) _
        And (Right(tmpstr, Len(DomainAdminsSIDEnd)) = DomainAdminsSIDEnd) Then
      CheckIfRunningAsDomainAdmin = True
      Exit For
    End If
    LogErrorIfNeeded "Error checking SID " & tmpstr
  Next
  If CheckIfRunningAsDomainAdmin Then
    LogStr "A:The current user is a member of Domain Admins"
  Else
    LogStr "E:The current user is *not* a member of Domain Admins"
    ErrorMsgBox "The current user isn't a member of the Domain Admins " & _
                "group. To successfully install and setup Password Sync, " & _
                "you must be a Domain Admin." & _
                vbNewLine & vbNewLine & _
                "Please contact a Domain Admin to continue. You can try " & _
                "running this command, it may add you to the Domain Admins " & _
                "group:" & vbNewLine & vbNewLine & _
                "net group ""Domain Admins"" " & _
                objShell.ExpandEnvironmentStrings("%username%") & " /add" & _
                vbNewLine & vbNewLine & _
                "After joining the Domain Admins group, log out and back " & _
                "in, and try again."
    ' TODO: Get the correct sAMAccountName for Domain Admins, as it may have
    ' been localized... It can be obtained using:
    ' GetObject("LDAP://<SID=" & ByteArrToHexString(objectSid) & ">").Get("sAMAccountName")
  End If
End Function

' Gets tokenGroups attribute from the provided DN
' Usage: <Array of tokens> = GetTokenGroups(<DN of object>)
Function GetTokenGroups(dnObject)
  Dim adsObject

  ' Setup query of tokenGroup SIDs from dnObject
  Set adsObject = GetObject("LDAP://" & Replace(dnObject, "/", "\/"))
  LogErrorIfNeeded "Error opening admin's DN using ADSI"
  adsObject.GetInfoEx Array("tokenGroups"), 0
  GetTokenGroups = adsObject.GetEx("tokenGroups")
  LogErrorIfNeeded "Error getting current user's tokenGroups"
End Function

' Encode Byte() to hex string
Function ByteArrToHexString(bytes)
   Dim i
   ByteArrToHexString = ""
   For i = 1 to LenB(bytes)
      ByteArrToHexString = _
          ByteArrToHexString & Right("0" & Hex(AscB(MidB(bytes, i, 1))), 2)
      LogErrorIfNeeded _
          "Error converting SID bytes to string at " & ByteArrToHexString
   Next
End Function

' Plans For the future:
' Support non-English systems (i.e. where folder paths are not in English).
' Make an HTML report instead of just collecting text files
' Support paths on upgraded systems such as "C:\WINNT\Profiles\All Users\Application Data\\Google\Google Apps Password Sync\config.xml" etc.
' Offer to restart DCs whose DLL is registered but not loaded, if not the current server
' Offer to start the service if it's stopped
' Ask which username is affected and get their LDIF dump, and correlate their pwdLastSet to appearance in the logs - this can tell us if the issue is with the service, the DLL, etc.
' Get the user's LDIF dump using the credentials detailed in the XML
' Try to find password change events in the Event Log for that user to see where password change occurred
' If any of the log files are missing, collect the ACL of that folder (in case there are no permissions for the service user to create the logs). Offer to fix.
' Ask what user was used to install on the other DCs so that we can get the correct path for UI logs, instead of guessing
' Compare XMLs across all servers
' Get relevant events from Windows Event Logs using "wevtutil"
' Get minidump files: %temp%\WER* folder on Win2008, C:\WINDOWS\pchealth\ERRORREP\UserDumps on Win2003
' Check certificates using certutil -store \\SERVERNAME\AuthRoot | find "Equifax" (or something similar)
' Compare time across DCs
' Compare time to google.com

'' SIG '' Begin signature block
'' SIG '' MIIauQYJKoZIhvcNAQcCoIIaqjCCGqYCAQExDzANBglg
'' SIG '' hkgBZQMEAgEFADB3BgorBgEEAYI3AgEEoGkwZzAyBgor
'' SIG '' BgEEAYI3AgEeMCQCAQEEEE7wKRaZJ7VNj+Ws4Q8X66sC
'' SIG '' AQACAQACAQACAQACAQAwMTANBglghkgBZQMEAgEFAAQg
'' SIG '' jBgzX/Akm38TAGyiDmlrki3eEPNsU3ANDfYlw0w6sPCg
'' SIG '' ggpfMIIFJzCCBA+gAwIBAgIQD/n3VHdV4hIUs/edbrbX
'' SIG '' qzANBgkqhkiG9w0BAQsFADByMQswCQYDVQQGEwJVUzEV
'' SIG '' MBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3
'' SIG '' d3cuZGlnaWNlcnQuY29tMTEwLwYDVQQDEyhEaWdpQ2Vy
'' SIG '' dCBTSEEyIEFzc3VyZWQgSUQgQ29kZSBTaWduaW5nIENB
'' SIG '' MB4XDTIwMDYwMzAwMDAwMFoXDTIzMDYwODEyMDAwMFow
'' SIG '' ZDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3Ju
'' SIG '' aWExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxEzARBgNV
'' SIG '' BAoTCkdvb2dsZSBMTEMxEzARBgNVBAMTCkdvb2dsZSBM
'' SIG '' TEMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
'' SIG '' AQC4pxx9G4j8tN3I3aq9vW0wWMfrKBPyLwJ5IXkIXLeF
'' SIG '' D03ooaT5J6T2dKdRec0WUbXL8MGUEKrsDiwd34Q2Wl36
'' SIG '' tewHdXmpn+cDa8865r7NXtv89wSuWLqIghTmRn1Kn2nC
'' SIG '' GcqBvQ+6RbbVEox54e15quDGLN8PiCOWMU+akUctf4Qj
'' SIG '' 6DfPsapyc2MyvcM/e2p1DacnDjA98CYs7H/eSOMShXSk
'' SIG '' 0ARY8bv/KoG+snyHyZdceThMEA8J1qCpyRyH6JBmLErg
'' SIG '' PSGXCchpduDeVGWzIybO6gEzC9e/Q2Rp4EO0/nkcqMpX
'' SIG '' ss4FLRjoyuO+zxNxMyrdz8raa/pWou/rkuzxAgMBAAGj
'' SIG '' ggHFMIIBwTAfBgNVHSMEGDAWgBRaxLl7KgqjpepxA8Bg
'' SIG '' +S32ZXUOWDAdBgNVHQ4EFgQU0cbMc++XrrVAXMcNEtTn
'' SIG '' plnCOE4wDgYDVR0PAQH/BAQDAgeAMBMGA1UdJQQMMAoG
'' SIG '' CCsGAQUFBwMDMHcGA1UdHwRwMG4wNaAzoDGGL2h0dHA6
'' SIG '' Ly9jcmwzLmRpZ2ljZXJ0LmNvbS9zaGEyLWFzc3VyZWQt
'' SIG '' Y3MtZzEuY3JsMDWgM6Axhi9odHRwOi8vY3JsNC5kaWdp
'' SIG '' Y2VydC5jb20vc2hhMi1hc3N1cmVkLWNzLWcxLmNybDBM
'' SIG '' BgNVHSAERTBDMDcGCWCGSAGG/WwDATAqMCgGCCsGAQUF
'' SIG '' BwIBFhxodHRwczovL3d3dy5kaWdpY2VydC5jb20vQ1BT
'' SIG '' MAgGBmeBDAEEATCBhAYIKwYBBQUHAQEEeDB2MCQGCCsG
'' SIG '' AQUFBzABhhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20w
'' SIG '' TgYIKwYBBQUHMAKGQmh0dHA6Ly9jYWNlcnRzLmRpZ2lj
'' SIG '' ZXJ0LmNvbS9EaWdpQ2VydFNIQTJBc3N1cmVkSURDb2Rl
'' SIG '' U2lnbmluZ0NBLmNydDAMBgNVHRMBAf8EAjAAMA0GCSqG
'' SIG '' SIb3DQEBCwUAA4IBAQAAsINEUXGVuX1+urMZY+OZVnAn
'' SIG '' Az9hnx3vzcOrN2pWg0kfognXDiOzTl2rn64S4q1CJs6r
'' SIG '' /5qyhybuEjm2t3tuGyB9sLiUQqE3ZlJ4Z5erM0M+VQAl
'' SIG '' uR+DRDjtba3FVB05e6G1fraORwj2k4VyIdjIUo1VaAG5
'' SIG '' etpKIF3tcnHhJy0huCYePi9cJWC1nmnttDWHHS9KyJST
'' SIG '' kuh6swW/tkMFR656OF+bRTY+Kmp+ACBszelLyVMDXweU
'' SIG '' aMRJ8KkPuCPIEezF2EUAATXF/uCGnpsupxBnl8yVwC5L
'' SIG '' 3ZcVgLc9avBS31cwS6sqvXlV5K8FOrLN0SuL+wDLfNN2
'' SIG '' 5GMn0Q3TMIIFMDCCBBigAwIBAgIQBAkYG1/Vu2Z1U0O1
'' SIG '' b5VQCDANBgkqhkiG9w0BAQsFADBlMQswCQYDVQQGEwJV
'' SIG '' UzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQL
'' SIG '' ExB3d3cuZGlnaWNlcnQuY29tMSQwIgYDVQQDExtEaWdp
'' SIG '' Q2VydCBBc3N1cmVkIElEIFJvb3QgQ0EwHhcNMTMxMDIy
'' SIG '' MTIwMDAwWhcNMjgxMDIyMTIwMDAwWjByMQswCQYDVQQG
'' SIG '' EwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYD
'' SIG '' VQQLExB3d3cuZGlnaWNlcnQuY29tMTEwLwYDVQQDEyhE
'' SIG '' aWdpQ2VydCBTSEEyIEFzc3VyZWQgSUQgQ29kZSBTaWdu
'' SIG '' aW5nIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
'' SIG '' CgKCAQEA+NOzHH8OEa9ndwfTCzFJGc/Q+0WZsTrbRPV/
'' SIG '' 5aid2zLXcep2nQUut4/6kkPApfmJ1DcZ17aq8JyGpdgl
'' SIG '' rA55KDp+6dFn08b7KSfH03sjlOSRI5aQd4L5oYQjZhJU
'' SIG '' M1B0sSgmuyRpwsJS8hRniolF1C2ho+mILCCVrhxKhwjf
'' SIG '' DPXiTWAYvqrEsq5wMWYzcT6scKKrzn/pfMuSoeU7MRzP
'' SIG '' 6vIK5Fe7SrXpdOYr/mzLfnQ5Ng2Q7+S1TqSp6moKq4Tz
'' SIG '' rGdOtcT3jNEgJSPrCGQ+UpbB8g8S9MWOD8Gi6CxR93O8
'' SIG '' vYWxYoNzQYIH5DiLanMg0A9kczyen6Yzqf0Z3yWT0QID
'' SIG '' AQABo4IBzTCCAckwEgYDVR0TAQH/BAgwBgEB/wIBADAO
'' SIG '' BgNVHQ8BAf8EBAMCAYYwEwYDVR0lBAwwCgYIKwYBBQUH
'' SIG '' AwMweQYIKwYBBQUHAQEEbTBrMCQGCCsGAQUFBzABhhho
'' SIG '' dHRwOi8vb2NzcC5kaWdpY2VydC5jb20wQwYIKwYBBQUH
'' SIG '' MAKGN2h0dHA6Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNvbS9E
'' SIG '' aWdpQ2VydEFzc3VyZWRJRFJvb3RDQS5jcnQwgYEGA1Ud
'' SIG '' HwR6MHgwOqA4oDaGNGh0dHA6Ly9jcmw0LmRpZ2ljZXJ0
'' SIG '' LmNvbS9EaWdpQ2VydEFzc3VyZWRJRFJvb3RDQS5jcmww
'' SIG '' OqA4oDaGNGh0dHA6Ly9jcmwzLmRpZ2ljZXJ0LmNvbS9E
'' SIG '' aWdpQ2VydEFzc3VyZWRJRFJvb3RDQS5jcmwwTwYDVR0g
'' SIG '' BEgwRjA4BgpghkgBhv1sAAIEMCowKAYIKwYBBQUHAgEW
'' SIG '' HGh0dHBzOi8vd3d3LmRpZ2ljZXJ0LmNvbS9DUFMwCgYI
'' SIG '' YIZIAYb9bAMwHQYDVR0OBBYEFFrEuXsqCqOl6nEDwGD5
'' SIG '' LfZldQ5YMB8GA1UdIwQYMBaAFEXroq/0ksuCMS1Ri6en
'' SIG '' IZ3zbcgPMA0GCSqGSIb3DQEBCwUAA4IBAQA+7A1aJLPz
'' SIG '' ItEVyCx8JSl2qB1dHC06GsTvMGHXfgtg/cM9D8Svi/3v
'' SIG '' Kt8gVTew4fbRknUPUbRupY5a4l4kgU4QpO4/cY5jDhNL
'' SIG '' rddfRHnzNhQGivecRk5c/5CxGwcOkRX7uq+1UcKNJK4k
'' SIG '' xscnKqEpKBo6cSgCPC6Ro8AlEeKcFEehemhor5unXCBc
'' SIG '' 2XGxDI+7qPjFEmifz0DLQESlE/DmZAwlCEIysjaKJAL+
'' SIG '' L3J+HNdJRZboWR3p+nRka7LrZkPas7CM1ekN3fYBIM6Z
'' SIG '' MWM9CBoYs4GbT8aTEAb8B4H6i9r5gkn3Ym6hU/oSlBiF
'' SIG '' LpKR6mhsRDKyZqHnGKSaZFHvMYIPsjCCD64CAQEwgYYw
'' SIG '' cjELMAkGA1UEBhMCVVMxFTATBgNVBAoTDERpZ2lDZXJ0
'' SIG '' IEluYzEZMBcGA1UECxMQd3d3LmRpZ2ljZXJ0LmNvbTEx
'' SIG '' MC8GA1UEAxMoRGlnaUNlcnQgU0hBMiBBc3N1cmVkIElE
'' SIG '' IENvZGUgU2lnbmluZyBDQQIQD/n3VHdV4hIUs/edbrbX
'' SIG '' qzANBglghkgBZQMEAgEFAKB8MBAGCisGAQQBgjcCAQwx
'' SIG '' AjAAMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwG
'' SIG '' CisGAQQBgjcCAQsxDjAMBgorBgEEAYI3AgEVMC8GCSqG
'' SIG '' SIb3DQEJBDEiBCBuBFDRq84bBy7FfzlQcFDV8xbkP8qW
'' SIG '' 8DuVavi9RJZK4TANBgkqhkiG9w0BAQEFAASCAQA2wNsx
'' SIG '' MxH3azxVnYl1cUTqsce2eLqs5QqdCw/bH4/SpRA0MHjP
'' SIG '' ieBDyK8DVv+QXMsh02tx/PJYarC8/wmjS3IYDmUABN8N
'' SIG '' FDFR7I4f6iNa7rdwV8h+tK06WxNAm8hFiveJ5UJohKs9
'' SIG '' 9ir1t36lwe0AWcrPniU3psUGlLTdg3W8z9johMHQvNIj
'' SIG '' FQEOT50kQc6YAanLBBpNA2iY3pEJHLe+WxV13yru4644
'' SIG '' xOQ3Bb+KVdIs0C3iF8ks1VamNex5NLhNIFAmSifK3wN6
'' SIG '' sD/t6HIwGA25SAwNBNJ+Qk5BdvdGFYVZurr/PeD6oLz0
'' SIG '' eoaK09IT8i6d4U/9GuVr3UpnjbMloYINfjCCDXoGCisG
'' SIG '' AQQBgjcDAwExgg1qMIINZgYJKoZIhvcNAQcCoIINVzCC
'' SIG '' DVMCAQMxDzANBglghkgBZQMEAgEFADB4BgsqhkiG9w0B
'' SIG '' CRABBKBpBGcwZQIBAQYJYIZIAYb9bAcBMDEwDQYJYIZI
'' SIG '' AWUDBAIBBQAEIFVZRi0c+YazjVk93ZM4Ft8b4J9dFy27
'' SIG '' mu19iO7DgDZPAhEAwe55X1pVAxEZupaYkbUOIxgPMjAy
'' SIG '' MTA3MTMxNDIyNDZaoIIKNzCCBP4wggPmoAMCAQICEA1C
'' SIG '' SuC+Ooj/YEAhzhQA8N0wDQYJKoZIhvcNAQELBQAwcjEL
'' SIG '' MAkGA1UEBhMCVVMxFTATBgNVBAoTDERpZ2lDZXJ0IElu
'' SIG '' YzEZMBcGA1UECxMQd3d3LmRpZ2ljZXJ0LmNvbTExMC8G
'' SIG '' A1UEAxMoRGlnaUNlcnQgU0hBMiBBc3N1cmVkIElEIFRp
'' SIG '' bWVzdGFtcGluZyBDQTAeFw0yMTAxMDEwMDAwMDBaFw0z
'' SIG '' MTAxMDYwMDAwMDBaMEgxCzAJBgNVBAYTAlVTMRcwFQYD
'' SIG '' VQQKEw5EaWdpQ2VydCwgSW5jLjEgMB4GA1UEAxMXRGln
'' SIG '' aUNlcnQgVGltZXN0YW1wIDIwMjEwggEiMA0GCSqGSIb3
'' SIG '' DQEBAQUAA4IBDwAwggEKAoIBAQDC5mGEZ8WK9Q0IpEXK
'' SIG '' Y2tR1zoRQr0KdXVNlLQMULUmEP4dyG+RawyW5xpcSO9E
'' SIG '' 5b+bYc0VkWJauP9nC5xj/TZqgfop+N0rcIXeAhjzeG28
'' SIG '' ffnHbQk9vmp2h+mKvfiEXR52yeTGdnY6U9HR01o2j8aj
'' SIG '' 4S8bOrdh1nPsTm0zinxdRS1LsVDmQTo3VobckyON91Al
'' SIG '' 6GTm3dOPL1e1hyDrDo4s1SPa9E14RuMDgzEpSlwMMYpK
'' SIG '' jIjF9zBa+RSvFV9sQ0kJ/SYjU/aNY+gaq1uxHTDCm2mC
'' SIG '' tNv8VlS8H6GHq756WwogL0sJyZWnjbL61mOLTqVyHO6f
'' SIG '' egFz+BnW/g1JhL0BAgMBAAGjggG4MIIBtDAOBgNVHQ8B
'' SIG '' Af8EBAMCB4AwDAYDVR0TAQH/BAIwADAWBgNVHSUBAf8E
'' SIG '' DDAKBggrBgEFBQcDCDBBBgNVHSAEOjA4MDYGCWCGSAGG
'' SIG '' /WwHATApMCcGCCsGAQUFBwIBFhtodHRwOi8vd3d3LmRp
'' SIG '' Z2ljZXJ0LmNvbS9DUFMwHwYDVR0jBBgwFoAU9LbhIB3+
'' SIG '' Ka7S5GGlsqIlssgXNW4wHQYDVR0OBBYEFDZEho6kurBm
'' SIG '' vrwoLR1ENt3janq8MHEGA1UdHwRqMGgwMqAwoC6GLGh0
'' SIG '' dHA6Ly9jcmwzLmRpZ2ljZXJ0LmNvbS9zaGEyLWFzc3Vy
'' SIG '' ZWQtdHMuY3JsMDKgMKAuhixodHRwOi8vY3JsNC5kaWdp
'' SIG '' Y2VydC5jb20vc2hhMi1hc3N1cmVkLXRzLmNybDCBhQYI
'' SIG '' KwYBBQUHAQEEeTB3MCQGCCsGAQUFBzABhhhodHRwOi8v
'' SIG '' b2NzcC5kaWdpY2VydC5jb20wTwYIKwYBBQUHMAKGQ2h0
'' SIG '' dHA6Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2Vy
'' SIG '' dFNIQTJBc3N1cmVkSURUaW1lc3RhbXBpbmdDQS5jcnQw
'' SIG '' DQYJKoZIhvcNAQELBQADggEBAEgc3LXpmiO85xrnIA6O
'' SIG '' Z0b9QnJRdAojR6OrktIlxHBZvhSg5SeBpU0UFRkHefDR
'' SIG '' BMOG2Tu9/kQCZk3taaQP9rhwz2Lo9VFKeHk2eie38+dS
'' SIG '' n5On7UOee+e03UEiifuHokYDTvz0/rdkd2NfI1Jpg4L6
'' SIG '' GlPtkMyNoRdzDfTzZTlwS/Oc1np72gy8PTLQG8v1Yfx1
'' SIG '' CAB2vIEO+MDhXM/EEXLnG2RJ2CKadRVC9S0yOIHa9GCi
'' SIG '' urRS+1zgYSQlT7LfySmoc0NR2r1j1h9bm/cuG08THfdK
'' SIG '' DXF+l7f0P4TrweOjSaH6zqe/Vs+6WXZhiV9+p7SOZ3j5
'' SIG '' NpjhyyjaW4emii8wggUxMIIEGaADAgECAhAKoSXW1jIb
'' SIG '' fkHkBdo2l8IVMA0GCSqGSIb3DQEBCwUAMGUxCzAJBgNV
'' SIG '' BAYTAlVTMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAX
'' SIG '' BgNVBAsTEHd3dy5kaWdpY2VydC5jb20xJDAiBgNVBAMT
'' SIG '' G0RpZ2lDZXJ0IEFzc3VyZWQgSUQgUm9vdCBDQTAeFw0x
'' SIG '' NjAxMDcxMjAwMDBaFw0zMTAxMDcxMjAwMDBaMHIxCzAJ
'' SIG '' BgNVBAYTAlVTMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMx
'' SIG '' GTAXBgNVBAsTEHd3dy5kaWdpY2VydC5jb20xMTAvBgNV
'' SIG '' BAMTKERpZ2lDZXJ0IFNIQTIgQXNzdXJlZCBJRCBUaW1l
'' SIG '' c3RhbXBpbmcgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IB
'' SIG '' DwAwggEKAoIBAQC90DLuS82Pf92puoKZxTlUKFe2I0rE
'' SIG '' DgdFM1EQfdD5fU1ofue2oPSNs4jkl79jIZCYvxO8V9PD
'' SIG '' 4X4I1moUADj3Lh477sym9jJZ/l9lP+Cb6+NGRwYaVX4L
'' SIG '' J37AovWg4N4iPw7/fpX786O6Ij4YrBHk8JkDbTuFfAnT
'' SIG '' 7l3ImgtU46gJcWvgzyIQD3XPcXJOCq3fQDpct1HhoXkU
'' SIG '' xk0kIzBdvOw8YGqsLwfM/fDqR9mIUF79Zm5WYScpiYRR
'' SIG '' 5oLnRlD9lCosp+R1PrqYD4R/nzEU1q3V8mTLex4F0IQZ
'' SIG '' chfxFwbvPc3WTe8GQv2iUypPhR3EHTyvz9qsEPXdrKzp
'' SIG '' Vv+TAgMBAAGjggHOMIIByjAdBgNVHQ4EFgQU9LbhIB3+
'' SIG '' Ka7S5GGlsqIlssgXNW4wHwYDVR0jBBgwFoAUReuir/SS
'' SIG '' y4IxLVGLp6chnfNtyA8wEgYDVR0TAQH/BAgwBgEB/wIB
'' SIG '' ADAOBgNVHQ8BAf8EBAMCAYYwEwYDVR0lBAwwCgYIKwYB
'' SIG '' BQUHAwgweQYIKwYBBQUHAQEEbTBrMCQGCCsGAQUFBzAB
'' SIG '' hhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20wQwYIKwYB
'' SIG '' BQUHMAKGN2h0dHA6Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNv
'' SIG '' bS9EaWdpQ2VydEFzc3VyZWRJRFJvb3RDQS5jcnQwgYEG
'' SIG '' A1UdHwR6MHgwOqA4oDaGNGh0dHA6Ly9jcmw0LmRpZ2lj
'' SIG '' ZXJ0LmNvbS9EaWdpQ2VydEFzc3VyZWRJRFJvb3RDQS5j
'' SIG '' cmwwOqA4oDaGNGh0dHA6Ly9jcmwzLmRpZ2ljZXJ0LmNv
'' SIG '' bS9EaWdpQ2VydEFzc3VyZWRJRFJvb3RDQS5jcmwwUAYD
'' SIG '' VR0gBEkwRzA4BgpghkgBhv1sAAIEMCowKAYIKwYBBQUH
'' SIG '' AgEWHGh0dHBzOi8vd3d3LmRpZ2ljZXJ0LmNvbS9DUFMw
'' SIG '' CwYJYIZIAYb9bAcBMA0GCSqGSIb3DQEBCwUAA4IBAQBx
'' SIG '' lRLpUYdWac3v3dp8qmN6s3jPBjdAhO9LhL/KzwMC/cWn
'' SIG '' ww4gQiyvd/MrHwwhWiq3BTQdaq6Z+CeiZr8JqmDfdqQ6
'' SIG '' kw/4stHYfBli6F6CJR7Euhx7LCHi1lssFDVDBGiy23UC
'' SIG '' 4HLHmNY8ZOUfSBAYX4k4YU1iRiSHY4yRUiyvKYnleB/W
'' SIG '' CxSlgNcSR3CzddWThZN+tpJn+1Nhiaj1a5bA9FhpDXzI
'' SIG '' AbG5KHW3mWOFIoxhynmUfln8jA/jb7UBJrZspe6HUSHk
'' SIG '' WGCbugwtK22ixH67xCUrRwIIfEmuE7bhfEJCKMYYVs9B
'' SIG '' NLZmXbZ0e/VWMyIvIjayS6JKldj1po5SMYIChjCCAoIC
'' SIG '' AQEwgYYwcjELMAkGA1UEBhMCVVMxFTATBgNVBAoTDERp
'' SIG '' Z2lDZXJ0IEluYzEZMBcGA1UECxMQd3d3LmRpZ2ljZXJ0
'' SIG '' LmNvbTExMC8GA1UEAxMoRGlnaUNlcnQgU0hBMiBBc3N1
'' SIG '' cmVkIElEIFRpbWVzdGFtcGluZyBDQQIQDUJK4L46iP9g
'' SIG '' QCHOFADw3TANBglghkgBZQMEAgEFAKCB0TAaBgkqhkiG
'' SIG '' 9w0BCQMxDQYLKoZIhvcNAQkQAQQwHAYJKoZIhvcNAQkF
'' SIG '' MQ8XDTIxMDcxMzE0MjI0NlowKwYLKoZIhvcNAQkQAgwx
'' SIG '' HDAaMBgwFgQU4deCqOGRvu9ryhaRtaq0lKYkm/MwLwYJ
'' SIG '' KoZIhvcNAQkEMSIEIKYCpkhbgC2+GB6LCF0NNbp5FTJ2
'' SIG '' BDRHtkMe2WResZoKMDcGCyqGSIb3DQEJEAIvMSgwJjAk
'' SIG '' MCIEILMQkAa8CtmDB5FXKeBEA0Fcg+MpK2FPJpZMjTVx
'' SIG '' 7PWpMA0GCSqGSIb3DQEBAQUABIIBAIPjm0BW8TgeAThs
'' SIG '' D5vtbhQMFEvkFyfcWmobav3yL2fHFiJE5+0hqwOIt9aF
'' SIG '' bUVYQ9gsKMFunZqUNeMXq91cn6MzB87sGFid0UQD713F
'' SIG '' zkhQ5ydQIfEtEXSgneGzRX+8uy10/dE5SjxqIeMuUclj
'' SIG '' 8o9ALKwvt5EyNnYLzaqmjW2UcKmYCEjoe8iVA3VkbXwV
'' SIG '' e4kvGLR7kz3kAYkxLCtn4fslgg4ksG3EDMWzcTJ4FUSN
'' SIG '' 7YaGASDVmyKdOAAdisFfGmheVD2YTFnpS4h2NMbMomV5
'' SIG '' B8UkQqHGHGojSs5EFyMgaVaWB+uTViVKgZrRzeSd3p3S
'' SIG '' y6t5z+1WAMPoBC+szTQ=
'' SIG '' End signature block
