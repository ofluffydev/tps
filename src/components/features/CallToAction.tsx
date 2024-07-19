import Link from "next/link";

interface CallToActionProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

function CallToAction({title, description, buttonText, buttonLink}: CallToActionProps) {
    return (<section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg mb-8">{description}</p>
            <Link href={buttonLink}>{buttonText}</Link>
        </div>
    </section>);
}

export default CallToAction;