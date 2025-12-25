import React from 'react'
import Hero from '@/components/home-component/Hero'
import HomeAbout from '@/components/home-component/HomeAbout'
import TestimonialsSection from '@/components/home-component/TestimonialsSection'
import SubscribeToNewsletter from '@/components/home-component/SubscribeToNewsletter'
import MemberSupport from '@/components/home-component/MemberSupport'
import MembershipLevels from '@/components/home-component/MembershipLevel'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeAbout />
      <MemberSupport />
      <MembershipLevels />
      <TestimonialsSection />
      <SubscribeToNewsletter />
    </>
  )
}
