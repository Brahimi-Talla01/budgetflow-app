import CtaSection from '../../components/home/CtaSection'
import FAQSection from '../../components/home/Faqs'
import Feature from '../../components/home/Feature'
import Footer from '../../components/home/Footer'
import Hero from '../../components/home/Hero'
import HowDoWork from '../../components/home/HowDoWork'
import MobileApp from '../../components/home/MobileApp'
import NavbarLanding from '../../components/home/NavbarLanding'
import OurFigures from '../../components/home/OurFigures'
import Prices from '../../components/home/Prices'
import Testimonials from '../../components/home/Testimonial'

const Home = () => {
  return (
    <div className='bg-light w-full min-h-full'>
      <NavbarLanding />
      <Hero />
      <Feature />
      <OurFigures />
      <HowDoWork />
      <Prices />
      <Testimonials />
      <FAQSection />
      <MobileApp />
      <CtaSection />
      <Footer />
    </div>
  )
}

export default Home
