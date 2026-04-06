import React from "react";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 min-h-screen">

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-12">
        About <span className="text-teal-600">Hobb Springs</span>
      </h1>

     
      <div className="flex flex-col md:flex-row items-center gap-10">

       
        <img
          className="w-full md:w-[480px] rounded-lg shadow-md"
          src="https://tse3.mm.bing.net/th/id/OIP.-FkfI80BU3ySIP_eSTN9kQHaGL?rs=1&pid=ImgDetMain&o=7&rm=3"
          alt="about"
        />

        
        <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-5">

          <p>
            Welcome to <strong>Hobb Springs</strong>, your trusted online store
            for modern lifestyle products. From the latest smartphones and
            stylish watches to fashionable clothing and accessories, we bring
            everything you need in one place.
          </p>

          <p>
            Our goal is to make online shopping simple, reliable, and enjoyable.
            We carefully select products that combine quality, durability, and
            style so our customers always get the best value.
          </p>

          <p>
            At Hobb Springs, customer satisfaction comes first. With secure
            payments, fast delivery, and responsive support, we strive to give
            every customer a smooth and trustworthy shopping experience.
          </p>

        </div>
      </div>
    </div>
  );
}