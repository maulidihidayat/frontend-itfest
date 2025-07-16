import AboutSection from '@/Components/AboutSection'
import { FAQSection } from '@/Components/Faq'
import Footer from '@/Components/footer'
import FormInpur from '@/Components/FormInpur'
import { Nav } from '@/Components/Nav'
import React from 'react'

export default function page() {
  return (
    <div className='h-screen '>
      <Nav />
      <FormInpur/>
      <AboutSection />
      <FAQSection />
      <Footer />  
    </div>
  )
}
