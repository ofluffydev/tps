"use client"

import React, {useState} from 'react';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import CallToAction from "@/components/features/CallToAction";
import Hero from "@/components/features/HomePage/Hero";
import Location from "@/components/features/AboutUsPage/Location";

const COMPONENTS = [
    [
        "Call to action",
        <CallToAction key="welcome-offer" title="Welcome Offer" buttonLink="#" buttonText="Claim Now" description="Get 50% off on your first purchase!"/>],
    [
        "Hero",
        <Hero key="hero"/>
    ],
    [
        "Location",
        <Location key="location" title="The Photo Store" address="3706 Olsen Blvd" city="Amarillo" state="Texas" zipCode="79109"/>
    ]
];

function PreviewPage() {
    const [selectedComponentIndex, setSelectedComponentIndex] = useState<number | null>(null);

    return (<main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Preview Page</h1>
            <div className="flex">
                <Card className="w-1/3 mr-4">
                    <CardHeader>Components</CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-gray-200">
                            {COMPONENTS.map((component, index) => (
                                <li
                                    key={index}
                                    onClick={() => setSelectedComponentIndex(index)}
                                    className="py-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {component[0]}
                                </li>))}
                        </ul>
                    </CardContent>
                </Card>
                <Card className="w-2/3">
                    <CardHeader>Preview</CardHeader>
                    <CardContent>
                        {selectedComponentIndex !== null ? (
                            <div className="border border-dashed border-gray-300 p-4 rounded">
                                {/*Get string from index 0 and show in h2*/}
                                <h2 className="text-xl font-bold mb-4">{COMPONENTS[selectedComponentIndex][0]}</h2>
                                {COMPONENTS[selectedComponentIndex][1]}
                            </div>) : (<p>Select a component to preview</p>)}
                    </CardContent>
                </Card>
            </div>
        </main>);
}

export default PreviewPage;