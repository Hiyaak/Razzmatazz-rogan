import React, { useEffect, useState } from 'react'
import RightPanelLayout from '../../Layout/RightPanelLayout'
import { ArrowLeft, CarFront } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  FaCarSide,
  FaWalking,
  FaHome,
  FaBuilding,
  FaBriefcase
} from 'react-icons/fa'
import ApiService from '../../Services/Apiservice'

const Adress = () => {
  const [selectedType, setSelectedType] = useState('Home')
  const [locationData, setLocationData] = useState(null)
  const [formData, setFormData] = useState({
    Block: '',
    Street: '',
    house: '',
    Floor: '',
    Building: '',
    Apartment: '',
    Office: '',
    Avenue: '',
    paci: '',
    additional: ''
  })

  const navigate = useNavigate()
  const storedBrandId = localStorage.getItem('brandId')
  const registredUserId = localStorage.getItem(
    `registredUserId_${storedBrandId}`
  )
  const guestUserId = sessionStorage.getItem(`guestUserId_${storedBrandId}`)

  // Get location for this brand
  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem(`selectedLocation_${storedBrandId}`) || '{}'
    )
    console.log('Selected Location Data:', storedData)
    setLocationData(storedData)
  }, [storedBrandId])

  const userId = registredUserId || guestUserId

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Prepare payload dynamically based on type
    let payload = {
      user_id: userId,
      type: selectedType.toLowerCase(),
      Block: formData.Block,
      Street: formData.Street,
      Avenue: formData.Avenue,
      paci: formData.paci,
      additional: formData.additional
    }

    if (selectedType === 'Home') {
      payload.house = formData.house
    } else if (selectedType === 'Apartment') {
      payload.Floor = formData.Floor
      payload.Building = formData.Building
      payload.Apartment = formData.Apartment
    } else if (selectedType === 'Office') {
      payload.Floor = formData.Floor
      payload.Building = formData.Building
      payload.Office = formData.Office
    }

    try {
      const { data } = await ApiService.post('/createAddress', payload)
      console.log('Address Created:', data)
      alert('Address created successfully!')
      setFormData({
        Block: '',
        Street: '',
        house: '',
        Floor: '',
        Building: '',
        Apartment: '',
        Office: '',
        Avenue: '',
        paci: '',
        additional: ''
      })
      navigate('/placeorder')
    } catch (error) {
      console.error('Error creating address:', error)
      alert('Failed to create address. Please try again.')
    }
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Left Sidebar */}
      <div className='w-full md:w-2/5 h-screen border-r border-gray-200 flex flex-col'>
        {/* Header */}
        <div className='p-2 border-b border-gray-200 flex-shrink-0'>
          <div className='flex items-center justify-between mb-1'>
            <button
              onClick={() => navigate(-1)}
              className='p-2 hover:bg-gray-200 rounded-full transition-colors'
            >
              <ArrowLeft className='w-5 h-5 text-gray-600' />
            </button>
            <div className='w-9' />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {/* Method Section */}
          <div>
            <div className='bg-gray-100 p-4 border-b'>
              <h2 className='text-base font-semibold text-gray-800'>Method</h2>
            </div>
            <div className='bg-white p-5 border-gray-300'>
              <div className='flex justify-center gap-24'>
                {/* Delivery */}
                <button
                  className={`flex items-center gap-3 px-6 py-2 rounded-sm font-medium transition-all duration-200 border ${
                    locationData?.selectedMethod?.toLowerCase() === 'delivery'
                      ? 'bg-[#FA0303] text-white border-[#FA0303]'
                      : 'bg-white text-[#FA0303] border-[#FA0303] hover:bg-red-50'
                  }`}
                >
                  <FaCarSide className='w-5 h-5' />
                  Delivery
                </button>

                {/* Pickup */}
                <button
                  className={`flex items-center gap-3 px-6 py-2 rounded-sm font-medium transition-all duration-200 border ${
                    locationData?.selectedMethod?.toLowerCase() === 'pickup'
                      ? 'bg-[#FA0303] text-white border-[#FA0303]'
                      : 'bg-white text-[#FA0303] border-[#FA0303] hover:bg-red-50'
                  }`}
                >
                  <FaWalking className='w-5 h-5' />
                  Pickup
                </button>
              </div>
            </div>
          </div>

          {/* Delivery Area & Location */}
          <div>
            <div className='bg-gray-100 p-4 border-b'>
              <h2 className='text-base font-semibold text-gray-800'>
                Delivery Area & Location
              </h2>
            </div>

            <div className='bg-white p-4 border-gray-300'>
              {locationData ? (
                <div className='flex items-center justify-between'>
                  {/* Left side - selected info */}
                  <div>
                    <p className='text-sm font-semibold'>
                      {locationData?.selectedArea
                        ? `${locationData.selectedArea}`
                        : 'No area selected'}
                    </p>
                  </div>

                  {/* Right side - Change button */}
                  <button
                    onClick={() => navigate('/pickupdeviler')}
                    className='text-[#FA0303] text-sm font-medium  hover:text-red-700'
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className='text-center text-gray-500'>
                  <p>No delivery location selected.</p>
                  <button
                    onClick={() => navigate('/pickupdeviler')}
                    className='mt-2 text-[#FA0303] font-medium text-sm underline hover:text-red-700'
                  >
                    Select Location
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Address Details Section */}
          <div>
            <div className='bg-gray-100 p-4 border-b'>
              <h2 className='text-base font-semibold text-gray-800'>
                Address Details
              </h2>
            </div>

            <div className='bg-white p-5 border-gray-300'>
              {/* Type Selector Buttons */}
              <div className='flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-10 px-4'>
                {[
                  { label: 'Home', icon: <FaHome className='w-5 h-5' /> },
                  {
                    label: 'Apartment',
                    icon: <FaBuilding className='w-5 h-5' />
                  },
                  { label: 'Office', icon: <FaBriefcase className='w-5 h-5' /> }
                ].map(({ label, icon }) => (
                  <button
                    key={label}
                    onClick={() => setSelectedType(label)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-sm font-medium transition-all duration-200 ${
                      selectedType === label
                        ? 'bg-[#FA0303] text-white border border-[#FA0303]'
                        : 'bg-white text-gray-700 border border-gray-400 hover:border-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>

              {/* Input Fields */}
              <form onSubmit={handleSubmit} className='space-y-8'>
                <input
                  type='text'
                  name='Block'
                  value={formData.Block}
                  onChange={handleChange}
                  placeholder='Block *'
                  className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                />

                <input
                  type='text'
                  name='Street'
                  value={formData.Street}
                  onChange={handleChange}
                  placeholder='Street *'
                  className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                />

                {/* Conditional Fields */}
                {selectedType === 'Home' && (
                  <input
                    type='text'
                    name='house'
                    value={formData.house}
                    onChange={handleChange}
                    placeholder='House # *'
                    className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                  />
                )}

                {selectedType === 'Apartment' && (
                  <>
                    <input
                      type='text'
                      name='Floor'
                      value={formData.Floor}
                      onChange={handleChange}
                      placeholder='Floor *'
                      className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                    />
                    <input
                      type='text'
                      name='Building'
                      value={formData.Building}
                      onChange={handleChange}
                      placeholder='Building Name *'
                      className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                    />
                    <input
                      type='text'
                      name='Apartment'
                      value={formData.Apartment}
                      onChange={handleChange}
                      placeholder='Apartment # *'
                      className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                    />
                  </>
                )}

                {selectedType === 'Office' && (
                  <>
                    <input
                      type='text'
                      name='Floor'
                      value={formData.Floor}
                      onChange={handleChange}
                      placeholder='Floor *'
                      className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                    />
                    <input
                      type='text'
                      name='Building'
                      value={formData.Building}
                      onChange={handleChange}
                      placeholder='Building Name *'
                      className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                    />
                    <input
                      type='text'
                      name='Office'
                      value={formData.Office}
                      onChange={handleChange}
                      placeholder='Office # *'
                      className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                    />
                  </>
                )}

                {/* Common Fields */}
                <input
                  type='text'
                  name='Avenue'
                  value={formData.Avenue}
                  onChange={handleChange}
                  placeholder='Avenue'
                  className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                />

                <input
                  type='text'
                  name='paci'
                  value={formData.paci}
                  onChange={handleChange}
                  placeholder='PACI'
                  className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                />

                <input
                  type='text'
                  name='additional'
                  value={formData.additional}
                  onChange={handleChange}
                  placeholder='Additional'
                  className='w-full bg-transparent border-b border-gray-300 focus:border-red-500 outline-none text-gray-700 placeholder-gray-500 pb-1'
                />

                <button
                  type='submit'
                  className='w-full bg-[#FA0303] hover:bg-[#AF0202] text-white py-3 rounded-lg transition-colors mt-6'
                >
                  Next
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <RightPanelLayout />
    </div>
  )
}

export default Adress
