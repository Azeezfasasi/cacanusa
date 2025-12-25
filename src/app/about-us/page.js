import CompanyOverview from '@/components/home-component/CompanyOverview'
import MembershipLevel from '@/components/home-component/MembershipLevel'
import PageTitle from '@/components/home-component/PageTitle'
import TeamSection from '@/components/home-component/TeamSection'
import WhyChooseUs from '@/components/home-component/WhyChooseUs'
import React from 'react'

export default function page() {
  return (
    <>
    <PageTitle title="About Us" subtitle="Learn more about our company and values" />
    <CompanyOverview />
    <MembershipLevel />
    <TeamSection />
    <WhyChooseUs />
    </>
  )
}
