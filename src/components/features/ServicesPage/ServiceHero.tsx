interface ServiceHeroProps {
    title: string;
    description: string;
}

export default function ServiceHero({title, description}: ServiceHeroProps) {
    return (
        <section className="bg-primary-500 text-black py-20 mt-20">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-4">{title}</h1>
                <p className="text-lg">{description}</p>
            </div>
        </section>
    );

}