import  React from "react"
import { Gift, Percent, Truck, IndianRupee } from "lucide-react"



const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center p-6 border border-neutral-200 rounded-sm">
      <div className="text-amber-700 mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-center mb-2">{title}</h3>
      <p className="text-neutral-600 text-center text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <Gift size={24} />,
      title: "Exclusive Gift",
      description: "An exclusive gift that embodies elegance and thoughtfulness, perfect for any special occasion..",
    },
    {
      icon: <Percent size={24} />,
      title: "Seasonal Discounts",
      description: "Enjoy exclusive seasonal discounts on our exquisite jewelry collection, perfect for adding a touch of elegance at a great price.",
    },
    {
      icon: <Truck size={24} />,
      title: "Free Delivery",
      description: "Enjoy free delivery on all orders, bringing your favorite jewelry right to your doorstep with no extra cost.",
    },
    {
      icon: <IndianRupee size={24} className="mr-1" />,
      title: "Budget-Friendly",
      description: "Discover budget-friendly jewelry options that combine style, quality, and affordability without compromising on elegance.",
    },
  ]

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
        ))}
      </div>
    </section>
  )
}

