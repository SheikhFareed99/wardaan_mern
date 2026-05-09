import Header from './header.jsx';
import Footer from './footer.jsx';
import { motion } from 'framer-motion';

const faqSections = [
  {
    title: 'About Us',
    items: [
      {
        question: 'Who is Vardaanswear?',
        answer:
          'Vardaanswear is an independently run e-commerce brand founded and managed by university students with a passion for premium cultural and modern wear. We started this platform to bring high-quality shalwar kameez and traditional Pakistani clothing directly to customers without the middleman. Every order, every stitch, and every delivery is something we personally care about.',
      },
      {
        question: 'Are you a registered business?',
        answer:
          'Yes. Vardaanswear is a legitimate e-commerce platform operating out of Pakistan. We are committed to building a trustworthy and transparent brand from the ground up.',
      },
      {
        question: 'How is your store managed?',
        answer:
          'Our store is fully student-run. From product sourcing and quality checks to customer support and order fulfillment, everything is handled in-house by our team. We take pride in being hands-on because your experience matters to us personally.',
      },
    ],
  },
  {
    title: 'Products & Quality',
    items: [
      {
        question: 'What kind of products do you sell?',
        answer:
          'We specialize in premium shalwar kameez and traditional Pakistani cultural wear for men, blending timeless tradition with a modern aesthetic.',
      },
      {
        question: 'What fabric or material do you use?',
        answer:
          'We source quality fabrics including lawn, khaddar, cotton, and blended materials depending on the season and product line. Each product listing specifies the fabric used so you always know what you are getting.',
      },
      {
        question: 'How do you ensure product quality?',
        answer:
          'Every piece goes through a manual quality check before it is dispatched. Since we are a small, student-run team, we can ensure close attention to detail on every order.',
      },
      {
        question: 'Are your products stitched or unstitched?',
        answer:
          'We offer both stitched and unstitched options depending on the collection. Product pages clearly indicate which type it is.',
      },
    ],
  },
  {
    title: 'Ordering',
    items: [
      {
        question: 'How do I place an order?',
        answer:
          'Browse our collection, select your size and preferred item, and proceed to checkout. We accept orders through our website 24/7.',
      },
      {
        question: 'Can I modify or cancel my order after placing it?',
        answer:
          'Orders can be modified or cancelled within 12 hours of placement. After that, the order may already be in processing. Contact us as soon as possible if you need to make a change.',
      },
      {
        question: 'Do you offer Cash on Delivery?',
        answer:
          'Yes. We offer Cash on Delivery across Pakistan. Online payment options are also available.',
      },
      {
        question: 'Will I receive a confirmation after ordering?',
        answer:
          'Yes, you will receive an order confirmation via email or WhatsApp after your purchase is placed.',
      },
    ],
  },
  {
    title: 'Shipping & Delivery',
    items: [
      {
        question: 'Where do you deliver?',
        answer:
          'We deliver across Pakistan. International shipping may be available for selected cases, so contact us to discuss.',
      },
      {
        question: 'How long does delivery take?',
        answer:
          'Standard delivery takes 3 to 7 business days depending on your location. Remote areas may take slightly longer.',
      },
      {
        question: 'How much does shipping cost?',
        answer:
          'Shipping charges are calculated at checkout based on your location. We occasionally run free shipping promotions, so follow us on social media to stay updated.',
      },
      {
        question: 'Can I track my order?',
        answer:
          'Yes. Once your order is dispatched, we share a tracking number with you via WhatsApp or email.',
      },
    ],
  },
  {
    title: 'Returns & Exchanges',
    items: [
      {
        question: 'What is your return or exchange policy?',
        answer:
          'We accept returns and exchanges within 7 days of delivery, provided the item is unused, unwashed, and in its original condition with tags intact.',
      },
      {
        question: 'What if I received a damaged or wrong item?',
        answer:
          'Please contact us within 48 hours of delivery with photos of the item. We will make it right through a replacement or a full refund where applicable.',
      },
      {
        question: 'How do I initiate a return?',
        answer:
          'Reach out to us via WhatsApp or email with your order number and reason for return. Our team will guide you through the process.',
      },
    ],
  },
  {
    title: 'Customer Support',
    items: [
      {
        question: 'How can I contact you?',
        answer:
          'You can contact us through WhatsApp at 03028016744, by email at thevardaansofficial@gmail.com, or through Instagram at @vardaanswear.',
      },
      {
        question: 'What are your support hours?',
        answer:
          'Our team is available Monday to Saturday, 10:00 AM to 8:00 PM PKT. We are a student-run team, so we appreciate your patience and we respond as fast as we can.',
      },
    ],
  },
  {
    title: 'Why Choose Vardaanswear?',
    items: [
      {
        question: 'What makes Vardaanswear different?',
        answer:
          'We are a student-built, passion-driven brand that personally quality-checks every order, offers affordable pricing without compromising quality, and creates cultural wear that respects tradition with a modern touch.',
      },
    ],
  },
];

const sizeChartRows = [
  { size: 'XS', chest: 22, shoulders: 17, length: 39.5, sleeves: 23, collar: 14.5, shalwar: 39, pajama: 39 },
  { size: 'S', chest: 23, shoulders: 17.5, length: 40.75, sleeves: 23.5, collar: 15, shalwar: 40, pajama: 40 },
  { size: 'M', chest: 24, shoulders: 18.5, length: 42.25, sleeves: 24.25, collar: 16, shalwar: 42, pajama: 42 },
  { size: 'L', chest: 25, shoulders: 19.5, length: 44, sleeves: 25, collar: 17, shalwar: 44, pajama: 44 },
  { size: 'XL', chest: 27, shoulders: 20.5, length: 45.25, sleeves: 25.5, collar: 18, shalwar: 45, pajama: 45 },
  { size: 'XXL', chest: 28.5, shoulders: 21.5, length: 46.5, sleeves: 26, collar: 18.5, shalwar: 46, pajama: 46 },
];

function FAQ() {
  return (
    <>
      <Header />
      <main className="bg-amber-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-serif font-bold text-amber-900">Frequently Asked Questions</h1>
            <div className="w-24 h-1 bg-amber-600 mx-auto mt-4"></div>
            <p className="mt-4 text-amber-800 max-w-3xl mx-auto">
              Find answers about our brand, products, ordering, shipping, returns, support, and sizing.
            </p>
          </motion.div>

          <section className="bg-white rounded-3xl shadow-lg border border-amber-100 p-6 sm:p-8 mb-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Size Chart</h2>
                <p className="text-sm text-gray-500 mt-1">Use the measurements below to find your best fit. When in between sizes, size up.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm border-collapse">
                <thead className="bg-amber-50 text-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold border-b border-amber-100">Size</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-amber-100">Chest (one side)</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-amber-100">Shoulders</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-amber-100">Length</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-amber-100">Sleeves</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-amber-100">Collar</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-amber-100">Shalwar Length</th>
                    <th className="px-4 py-3 text-left font-semibold border-b border-amber-100">Pajama Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sizeChartRows.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{row.size}</td>
                      <td className="px-4 py-3 text-gray-700">{row.chest}</td>
                      <td className="px-4 py-3 text-gray-700">{row.shoulders}</td>
                      <td className="px-4 py-3 text-gray-700">{row.length}</td>
                      <td className="px-4 py-3 text-gray-700">{row.sleeves}</td>
                      <td className="px-4 py-3 text-gray-700">{row.collar}</td>
                      <td className="px-4 py-3 text-gray-700">{row.shalwar}</td>
                      <td className="px-4 py-3 text-gray-700">{row.pajama}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="rounded-2xl bg-amber-50 p-5 border border-amber-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Measure</h3>
                <ul className="space-y-2 text-gray-700 text-sm leading-6">
                  <li>Chest: Measure across the chest from one side to the other.</li>
                  <li>Shoulders: Measure from shoulder seam to shoulder seam.</li>
                  <li>Length: Measure from shoulder to the bottom hem.</li>
                  <li>Sleeves: Measure from shoulder to wrist.</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-amber-50 p-5 border border-amber-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Fitting Tips</h3>
                <ul className="space-y-2 text-gray-700 text-sm leading-6">
                  <li>Choose your regular size for a traditional fit.</li>
                  <li>Consider sizing up for a slimmer or more relaxed fit.</li>
                  <li>All measurements are in inches.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            {faqSections.map((section) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {section.items.map((item) => (
                    <details key={item.question} className="group">
                      <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-amber-50 transition-colors">
                        <span className="font-medium text-gray-900">{item.question}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <div className="px-6 pb-5 text-gray-700 leading-7 text-sm sm:text-base">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </motion.div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default FAQ;
