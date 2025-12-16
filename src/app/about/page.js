export default function AboutPage() {
  /* ---------------------------------------------------
     🔷 DYNAMIC DATA — Edit these values only
  --------------------------------------------------- */

  const name = {
    first: "Jack A.",
    last: "Catchings",
  };

  const introText = `
    Lorem ipsum dolor sit amet consectetur adipiscing elit. 
    Quisque faucibus ex sapien vitae pellentesque sem placerat. 
    In id cursus mi pretium tellus duis convallis. 
    Tempus leo eu aenean sed diam urna tempor.
  `;

  const education = [
    {
      label: "Education",
      text: "Auburn University",
    },
  ];

  const contact = [
    {
      label: "Contact",
      text: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    },
  ];

  const experience = [
    {
      date: "05/2015 – 06/2020",
      name: "Company Name",
      place: "City, State",
      position: "Position Title",
      bullets: ["Text here", "Text here", "Text here"],
    },
  ];

  const involvement = [
    {
      date: "05/2015 – 06/2020",
      name: "Organization Name",
      place: "City, State",
      position: "Position Title",
      bullets: ["Text here", "Text here", "Text here"],
    },
  ];

  const skillsLeft = ["Column", "Column", "Column", "Column"];
  const skillsRight = ["Column", "Column", "Column", "Column"];

  /* ---------------------------------------------------
     🔷 UI STARTS HERE
  --------------------------------------------------- */

  return (
    <div className="text-white px-6 md:px-20 lg:px-40 py-20 space-y-20">

      {/* ---------------------------------------------------
         NAME + INTRO
      --------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:justify-between gap-10">
        <div>
          <h1 className="text-5xl font-bold text-[#00D8FF] leading-tight">
            {name.first}<br />{name.last}
          </h1>
        </div>

        <p className="max-w-xl text-gray-300 leading-relaxed">
          {introText}
        </p>
      </div>

      <div className="border-t border-gray-600 w-full my-8"></div>

      {/* ---------------------------------------------------
         EDUCATION + CONTACT
      --------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* EDUCATION */}
        <div>
          {education.map((item, i) => (
            <div key={i}>
              <span className="px-3 py-1 bg-[#00D8FF] text-black font-semibold text-sm">
                {item.label}
              </span>
              <p className="mt-3 text-gray-300 max-w-sm">{item.text}</p>
            </div>
          ))}
        </div>

        {/* CONTACT */}
        <div>
          {contact.map((item, i) => (
            <div key={i}>
              <span className="px-3 py-1 bg-[#00D8FF] text-black font-semibold text-sm">
                {item.label}
              </span>
              <p className="mt-3 text-gray-300 max-w-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------
         EXPERIENCE SECTION
      --------------------------------------------------- */}
      <div>
        <span className="px-3 py-1 bg-[#00D8FF] text-black font-semibold text-sm">
          Experience
        </span>

        <div className="mt-6 space-y-10">
          {experience.map((exp, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-10">

              <p className="text-gray-400 min-w-[160px]">{exp.date}</p>

              <div>
                <p className="font-semibold">
                  {exp.name} <span className="text-gray-400">| {exp.place}</span>
                </p>
                <p className="text-gray-400 mb-2">{exp.position}</p>

                <ul className="list-disc pl-6 text-gray-300">
                  {exp.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------
         INVOLVEMENT SECTION
      --------------------------------------------------- */}
      <div>
        <span className="px-3 py-1 bg-[#00D8FF] text-black font-semibold text-sm">
          Involvement
        </span>

        <div className="mt-6 space-y-10">
          {involvement.map((inv, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-10">

              <p className="text-gray-400 min-w-[160px]">{inv.date}</p>

              <div>
                <p className="font-semibold">
                  {inv.name} <span className="text-gray-400">| {inv.place}</span>
                </p>
                <p className="text-gray-400 mb-2">{inv.position}</p>

                <ul className="list-disc pl-6 text-gray-300">
                  {inv.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------
         SKILLS SECTION
      --------------------------------------------------- */}
      <div>
        <span className="px-3 py-1 bg-[#00D8FF] text-black font-semibold text-sm">
          Skills
        </span>

        <div className="grid grid-cols-2 gap-12 mt-6">
          {/* LEFT COLUMN */}
          <div className="space-y-1">
            {skillsLeft.map((skill, i) => (
              <p key={i} className="text-gray-300">{skill}</p>
            ))}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-1">
            {skillsRight.map((skill, i) => (
              <p key={i} className="text-gray-300">{skill}</p>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
