import Contact from "@/components/features/ContactPage/Contact";

export default function ContactPage() {
  return (
    <main>
      <Contact
        phone="(806) 358-9616"
        email="melissa@thephotostore.com"
        facebook="thephotostore"
        includeForm={false}
      />
    </main>
  );
}
