"use client";

import React, {
  ChangeEvent,
  FC,
  FormEvent,
  ReactElement,
  useState,
} from "react";
import { Globe, Mail, MailWarning, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface ContactProps {
  email?: string;
  phone?: string;
  website?: string;
  discordUser?: string;
  discordServer?: string;
  facebook?: string;
  x?: string;
  github?: string;
  includeForm?: boolean;
}

const Contact: FC<ContactProps> = ({
  email,
  phone,
  website,
  discordUser,
  discordServer,
  facebook,
  x,
  github,
  includeForm = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    setFormSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const ContactItem: FC<{
    icon: ReactElement;
    label: string;
    value: string;
    href?: string;
  }> = ({ icon, label, value, href }) => (
    <div className="flex items-center mb-4 flex-wrap">
      <div className="flex items-center mr-2 mb-1">
        {icon}
        <span className="ml-2 font-semibold">{label}:</span>
      </div>
      {href ? (
        <a
          href={href}
          className="text-blue-500 hover:underline break-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
      ) : (
        <span className="break-all">{value}</span>
      )}
    </div>
  );

  return (
    <section className="mt-10 py-10 sm:py-20 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 gap-6 mb-8">
          {email && (
            <ContactItem
              icon={<Mail className="w-5 h-5 text-blue-500" />}
              label="Email"
              value={email}
              href={`mailto:${email}`}
            />
          )}
          {phone && (
            <ContactItem
              icon={<Phone className="w-5 h-5 text-blue-500" />}
              label="Phone"
              value={phone}
              href={`tel:${phone}`}
            />
          )}
          {website && (
            <ContactItem
              icon={<Globe className="w-5 h-5 text-blue-500" />}
              label="Website"
              value={website}
              href={website}
            />
          )}
          {discordUser && (
            <ContactItem
              icon={
                <Image
                  unoptimized
                  className="w-5 h-5"
                  width={20}
                  height={20}
                  src="https://cdn.simpleicons.org/discord/3B82F6"
                  alt="Discord Logo"
                />
              }
              label="Discord User"
              value={discordUser}
            />
          )}
          {discordServer && (
            <ContactItem
              icon={
                <Image
                  unoptimized
                  className="w-5 h-5"
                  width={20}
                  height={20}
                  src="https://cdn.simpleicons.org/discord/3B82F6"
                  alt="Discord Logo"
                />
              }
              label="Discord Server"
              value="Join Our Server"
              href={discordServer}
            />
          )}
          {facebook && (
            <ContactItem
              icon={
                <Image
                  unoptimized
                  className="w-5 h-5"
                  width={20}
                  height={20}
                  src="https://cdn.simpleicons.org/facebook/0866FF"
                  alt="Facebook Logo"
                />
              }
              label="Facebook"
              value={facebook}
              href={`https://facebook.com/${facebook}`}
            />
          )}
          {x && (
            <ContactItem
              icon={
                <Image
                  unoptimized
                  className="w-5 h-5"
                  width={20}
                  height={20}
                  src="https://cdn.simpleicons.org/x/3B82F6"
                  alt="X Logo"
                />
              }
              label="X"
              value={`@${x}`}
              href={`https://x.com/${x}`}
            />
          )}
          {github && (
            <ContactItem
              icon={
                <Image
                  unoptimized
                  className="w-5 h-5"
                  width={20}
                  height={20}
                  src="https://cdn.simpleicons.org/github/3B82F6"
                  alt="GitHub Logo"
                />
              }
              label="GitHub"
              value={github}
              href={`https://github.com/${github}`}
            />
          )}
        </div>

        {includeForm && (
          <>
            <Alert className="bg-red-400 border-red-600 mb-3">
              <MailWarning className="text-red-800" />
              <AlertTitle>Testing Only</AlertTitle>
              <AlertDescription>
                This form doesn&apos;t send emails anywhere yet. For now, please
                use any of the methods above to contact us.
              </AlertDescription>
            </Alert>
            <form onSubmit={handleSubmit} className="text-black space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                required
                value={formData.message}
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                className="w-full hover:shadow-purple-400 hover:shadow-2xl transition-shadow duration-500"
              >
                Send Message
              </Button>
            </form>
          </>
        )}

        {formSubmitted && (
          <Alert className="mt-4">
            <AlertDescription>
              Thank you for your message. We&apos;ll get back to you soon!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </section>
  );
};

export default Contact;
