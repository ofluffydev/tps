import FadeInView from "@/components/ui/FadeInView";
import PersonCard from "@/components/features/AboutUsPage/PersonCard";
import Location from "@/components/features/AboutUsPage/Location";

export default function About() {
    return (<main className="container mx-auto px-4 py-12 mt-20 space-y-16">
        <FadeInView>
            <h1 className="text-4xl font-bold text-center mb-12">About Us</h1>
        </FadeInView>

        <section className="space-y-8">
            <FadeInView>
                <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
                <h3 className="text-2xl font-semibold mb-4">Our Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PersonCard
                        name="Melissa Frisk"
                        about="Melissa Frisk joined The Photo Store in November 2004, dedicating over 8 years to the company before purchasing it in 2013. Her transition from employee to owner showcases her commitment and business acumen. Under Melissa's leadership, the store has successfully adapted to the digital age while maintaining its reputation for quality and personalized service. Her innovative approach and warm personality have expanded the business, fostering a loyal customer base and a positive work environment."
                        image="/melissa.jpg"
                    />
                    <PersonCard
                        name="Ashlyn"
                        about="Ashlyn joined The Photo Store in 2015, bringing her dual expertise in photography and graphic design. Over the past nine years, her creative vision and technical skills have been instrumental in delivering high-quality work to our clients. Ashlyn's versatility and dedication have significantly contributed to our store's reputation for excellence in both photography and design services."
                        image="/ashlyn.jpg"
                    />
                </div>
            </FadeInView>
        </section>

        <section className="space-y-4">
            <FadeInView>
                <h2 className="text-3xl font-bold mb-4">Locations</h2>
                <Location address="3706 Olsen Blvd" city="Amarillo" state="Texas" zipCode="79109"/>
            </FadeInView>
        </section>

        <section className="space-y-4">
            <FadeInView>
                <h2 className="text-3xl font-bold mb-4">History</h2>
                <div className="flex gap-4 flex-col">
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Founded in 1987</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Frisk Photo was founded in 1987 by Myrle & Coralis. The company started as a small lab that
                            mainly focuses on film processing and has grown to include a photo store and photography
                            services.
                        </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Melissa takes over the photo store in 2013</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            In 2013 Melissa Frisk purchased the company. She brought new ideas and expanded the
                            company&apos;s services to include digital photography. She has kept The Photo Store alive
                            and
                            growing for over 10 years.
                        </p>
                    </div>
                </div>
            </FadeInView>
        </section>
    </main>);
}