import TableOfContents from "./TableOfContents";
import AboutContent from "./AboutContent";

const AboutPage = () => {
  const sections = [
    {id: 'introduction', title: 'はじめに' },
    { id: 'howtouse', title: '使い方' },
    { id: 'password', title: 'パスワードを忘れたときは？' },
  ]
  return (
    <div className="about-page">
      <TableOfContents sections={sections}/>
      <AboutContent sections={sections}/>
    </div>
  );
};

export default AboutPage;
