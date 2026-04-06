const Contact = () => {
  return (
    <div>
      <div className="flex flex-col my-10 justify-center md:flex-row mb-28 gap-10">
        <img
          className="w-full md:max-w-[480px]"
          src="https://tse3.mm.bing.net/th/id/OIP.YHcs9N-v0LQTN9FbTOCF8AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3
"
          alt=""
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500 ">
            54709 Willms Station <br /> Suite, 350 Washington{" "}
          </p>
          <p className="text-gray-500">
            Tel (+923195378220) <br />
            Email: admin@hobbsprings.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at Hobb Springs
          </p>
          <p className="text-gray-500 ">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 ">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
