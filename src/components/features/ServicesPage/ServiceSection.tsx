class Service {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }
}

interface ServiceSectionProps {
  title: string;
  description: string;
  services: Service[];
}

export default function ServiceSection({
  title,
  description,
  services,
}: ServiceSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg mb-8">{description}</p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
