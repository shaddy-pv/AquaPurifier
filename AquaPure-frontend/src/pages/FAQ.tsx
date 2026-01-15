import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
import SEO from "@/components/SEO";

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      name: "General",
      faqs: [
        {
          question: "What is a water purifier and why do I need one?",
          answer: "A water purifier removes harmful contaminants, bacteria, and impurities from water, making it safe for drinking. It's essential for protecting your family's health from waterborne diseases."
        },
        {
          question: "How does RO water purification work?",
          answer: "Reverse Osmosis (RO) uses a semi-permeable membrane to remove dissolved solids, heavy metals, and contaminants from water. Water is forced through the membrane under pressure, leaving impurities behind."
        },
        {
          question: "What is the difference between RO, UV, and UF?",
          answer: "RO removes dissolved impurities and TDS, UV kills bacteria and viruses using ultraviolet light, and UF removes suspended particles. Our purifiers combine all three for complete protection."
        }
      ]
    },
    {
      name: "Installation & Maintenance",
      faqs: [
        {
          question: "Is installation included in the price?",
          answer: "Yes, professional installation is completely free with every purchase. Our certified technicians will install the purifier at your preferred location."
        },
        {
          question: "How often should I service my water purifier?",
          answer: "We recommend servicing every 3-6 months depending on usage and water quality. Regular maintenance ensures optimal performance and water quality."
        },
        {
          question: "When should I replace the filters?",
          answer: "Pre-filters should be replaced every 6 months, RO membrane every 2-3 years, and post-carbon filter annually. Our purifiers have filter change indicators."
        }
      ]
    },
    {
      name: "Product & Features",
      faqs: [
        {
          question: "What is the storage capacity I should choose?",
          answer: "For a family of 4-5 members, a 7-9L capacity is ideal. Larger families or offices should opt for 12-15L capacity purifiers."
        },
        {
          question: "Do your purifiers retain essential minerals?",
          answer: "Yes, our purifiers feature TDS controllers and mineralizers that retain essential minerals like calcium and magnesium while removing harmful contaminants."
        },
        {
          question: "What is the power consumption?",
          answer: "Our purifiers are energy-efficient, consuming only 25-60 watts depending on the model. They're designed to minimize electricity costs."
        }
      ]
    },
    {
      name: "Warranty & Support",
      faqs: [
        {
          question: "What warranty do you provide?",
          answer: "All products come with 1-year comprehensive warranty and 3-year warranty on the RO membrane. Extended warranty options are available."
        },
        {
          question: "Do you provide AMC services?",
          answer: "Yes, we offer Annual Maintenance Contracts (AMC) with regular servicing, free filter replacements, and priority support."
        },
        {
          question: "How can I contact customer support?",
          answer: "Call our toll-free number 1800-123-AQUA, email support@aquapure.com, or use our live chat. We're available 24/7."
        }
      ]
    },
    {
      name: "Orders & Delivery",
      faqs: [
        {
          question: "What are the delivery charges?",
          answer: "Delivery is FREE on all orders above ₹10,000. For orders below that, a nominal shipping charge applies based on your location."
        },
        {
          question: "How long does delivery take?",
          answer: "Metro cities: 2-3 days, Other cities: 3-5 days, Remote areas: 5-7 days. You'll receive tracking information via SMS and email."
        },
        {
          question: "Can I return or exchange a product?",
          answer: "Yes, we offer 7-day return and 15-day exchange policy. Products must be unused and in original packaging with all accessories."
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen py-12">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about AquaPure water purifiers, installation, maintenance, warranty, and more."
        keywords="water purifier faq, ro purifier questions, aquapure support"
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our products and services
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {category.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {category.faqs.length} questions
                  </span>
                </div>

                <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                          <AccordionTrigger className="text-left hover:text-primary">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No questions found matching your search.
              </p>
              <p className="text-sm text-muted-foreground">
                Try different keywords or{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contact our support team
                </a>
              </p>
            </div>
          )}

          {/* Still have questions */}
          <Card className="mt-12 border-0 shadow-premium bg-gradient-hero text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="mb-6 opacity-90">
                Can't find the answer you're looking for? Our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="tel:1800123AQUA"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Call 1800-123-AQUA
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
