import React, { useEffect, useState } from 'react'
import {
  Clock,
  MapPin,
  Menu,
  ShoppingBag,
  Search,
  User,
  Leaf
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import heroImage from '../../assets/concept.jpg'

import oak from '../../assets/roghan.png'
import ApiService, { ImagePath } from '../../Services/Apiservice'

const FoodDeliveryApp = () => {
  const [productCategories, setproductCategories] = useState([])
  const [selectedTab, setSelectedTab] = useState('Delivery')
  const [brandId, setBrandId] = useState(null)
  const navigate = useNavigate()

  const {
    selectedMethod,
    selectedGovernate,
    selectedGovernateId,
    selectedArea,
    selectedAreaId
  } = JSON.parse(localStorage.getItem('selectedLocation') || '{}')

  console.log('Full selectedLocation:', {
    selectedMethod,
    selectedGovernate,
    selectedGovernateId,
    selectedArea,
    selectedAreaId
  })

  const getProductCategories = async () => {
    try {
      const { data } = await ApiService.get(
        `getAllProductByBrandName/Roghan`
      )
      if (data.status) {
        setproductCategories(data.products)

        if (data.products.length > 0) {
          const brandIdFromApi = data.products[0].brand_id
          setBrandId(brandIdFromApi)

          localStorage.setItem('brandId', brandIdFromApi)
        }

        // console.log('brand products:', data.products)
      }
    } catch (error) {
      console.log('error ', error)
    }
  }

  useEffect(() => {
    getProductCategories()
  }, [])

  const handleProduct = (productId, productName) => {
    navigate(
      `/subproduct/${encodeURIComponent(productName)}?productId=${productId}`
    )
  }

  const handleMenuClick = () => {
    navigate('/menu')
  }

  const handleshoopingcartClick = () => {
    navigate('/shoopingcart')
  }

  const handleBrandClick = () => {
    navigate('/review')
  }

  const pickupdelivery = method => {
    navigate('/pickupdeviler', { state: { method } })
  }

  const goToCart = () => {
    navigate('/cartitems')
  }

  return (
    <>
      {/* Desktop layout (md and up) */}
      <div className='hidden md:flex min-h-screen bg-gray-50'>
        <div className='w-2/5 bg-white border-r border-gray-200 flex flex-col'>
          <div
            onClick={handleBrandClick}
            className='px-4 py-3 border-b border-gray-200 cursor-pointer transition-colors'
          >
            <div className='flex items-center space-x-3'>
              {/* Logo */}
              <img src={oak} alt='Logo' className='w-20 h-20 object-contain' />

              {/* Brand text */}
              <div>
                <h1 className='text-x2 font-bold text-gray-900'>
                  Roghan
                </h1>
                <p className='text-sm text-gray-600 mt-1'>
                  Smoke Meat Everyday
                </p>
              </div>
            </div>

            <hr className='border-t border-gray-200 -mx-4' />

            <div className='flex p-4 justify-center space-x-20'>
              <button
                onClick={e => {
                  e.stopPropagation()
                  setSelectedTab('Delivery')
                  pickupdelivery('delivery')
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedTab === 'Delivery'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-500 text-gray-600 hover:bg-red-200'
                  }`}
              >
                Delivery
              </button>
              <button
                onClick={e => {
                  e.stopPropagation()
                  setSelectedTab('Pickup')
                  pickupdelivery('pickup')
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedTab === 'Pickup'
                  ? 'bg-white-900 text-white'
                  : 'bg-red-500 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                Pickup
              </button>
            </div>
          </div>

          {/* Location and Time */}
          <div className='px-4 pb-4 space-y-4 mt-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <MapPin className='w-5 h-5 text-gray-400' />
                <div>
                  <p className='font-medium text-gray-900'>
                    {selectedMethod === 'delivery'
                      ? 'Deliver to'
                      : 'Pickup from'}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {selectedGovernate ? `${selectedGovernate}, ` : ''}
                    {selectedArea || 'No location selected'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/pickupdeviler')}
                className='text-red-500 font-medium hover:text-red-600'
              >
                Edit
              </button>
            </div>

            <div className='flex items-center space-x-3'>
              <Clock className='w-5 h-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>Earliest Pickup</p>
              </div>
            </div>
          </div>

          {/* Food Categories - Side by Side */}
          <div className='flex-1 px-4 space-y-4'>
            <div className='grid grid-cols-2 gap-4 cursor-pointer'>
              {productCategories.map(item => (
                <div
                  key={item._id}
                  className='relative rounded-lg overflow-hidden shadow group'
                  onClick={() => handleProduct(item._id, item.productName)}
                >
                  <img
                    src={`${ImagePath}${item.product_img[0]}`}
                    alt={item.productName}
                    className='w-full h-56 object-cover'
                  />
                  <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
                    <h3 className='text-white font-bold text-lg text-center'>
                      {item.productName}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Select Location Button */}
          {!(selectedMethod && (selectedArea || selectedGovernate)) && (
            <div className='p-3'>
              <button
                onClick={() => navigate('/pickupdeviler')} // navigate to pickup/delivery screen
                className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors'
              >
                Select your location
              </button>
            </div>
          )}
        </div>

        {/* Right Panel - 60% */}
        <div className='flex-1 relative bg-black'>
          {/* Top Navigation */}
          <div className='absolute top-6 left-6 right-6 z-10'>
            <div className='flex justify-between items-center'>
              <div className='flex space-x-4'>
                <button
                  onClick={handleMenuClick}
                  className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all'
                >
                  <Menu className='w-6 h-6' />
                </button>
                <button
                  onClick={handleshoopingcartClick}
                  className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all'
                >
                  <ShoppingBag className='w-6 h-6' />
                </button>
                <button className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all'>
                  <Search className='w-6 h-6' />
                </button>
                <button className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all'>
                  <User className='w-6 h-6' />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Banner Image */}
          <img
            src={heroImage}
            alt='Hero Food'
            className='w-full h-full object-cover'
          />

          <div className='absolute bottom-8 left-8 z-20'>
            <div className='w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
              IG
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout (below md) */}
      <div className='block md:hidden flex flex-col min-h-screen bg-gray-50'>
        {/* Top Navigation Bar */}
        <nav className='w-full flex items-center justify-between px-4 py-3 bg-white shadow-sm sticky top-0 z-20'>
          <div className='flex items-center space-x-2'>
            <button onClick={handleMenuClick} className='p-2'>
              <Menu className='w-6 h-6 text-gray-700' />
            </button>
          </div>
          <div
            onClick={handleBrandClick}
            className='flex items-center space-x-2 cursor-pointer'
          >
            <div className='flex items-center justify-center w-8 h-8 bg-red-100 rounded-full'>
              <Leaf className='w-4 h-4 text-red-600' />
            </div>
            <div className='font-bold text-xl text-red-600'>Roghan</div>
          </div>
          <div className='flex items-center space-x-2'>
            <button onClick={handleshoopingcartClick} className='p-2'>
              <ShoppingBag className='w-6 h-6 text-gray-700' />
            </button>
            <button className='p-2'>
              <Search className='w-6 h-6 text-gray-700' />
            </button>
            <button className='p-2'>
              <User className='w-6 h-6 text-gray-700' />
            </button>
          </div>
        </nav>

        {/* Hero Image */}
        <div className='w-full relative'>
          <img
            src={heroImage}
            alt='Hero Food'
            className='w-full h-48 object-cover'
          />

          {/* Instagram Floating Button */}
          <div className='absolute bottom-4 left-4 z-20'>
            <div className='w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
              IG
            </div>
          </div>

          {/* Brand Logo on Hero */}
          <div className='absolute bottom-4 right-4 z-10'>
            <div className='text-red-500 font-bold text-2xl transform -rotate-12'></div>
          </div>
        </div>

        {/* Delivery/Pickup Tabs */}
        <div className='flex p-4 justify-center space-x-4'>
          <button
            onClick={() => {
              setSelectedTab('Delivery')
              pickupdelivery()
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedTab === 'Delivery'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Delivery
          </button>
          <button
            onClick={() => {
              setSelectedTab('Pickup')
              pickupdelivery()
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${selectedTab === 'Pickup'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            Pickup
          </button>
        </div>

        {/* Location and Time Info */}
        <div className='w-full bg-white px-4 py-4 flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <MapPin className='w-5 h-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>
                  {selectedMethod === 'delivery' ? 'Deliver to' : 'Pickup from'}
                </p>
                <p className='font-medium text-gray-900'>
                  {selectedGovernate || selectedArea
                    ? `${selectedGovernate || ''}${selectedGovernate && selectedArea ? ', ' : ''}${selectedArea || ''}`
                    : 'Choose location'}
                </p>
              </div>
            </div>
            <button className='text-red-500 font-medium hover:text-red-600 text-sm'>
              Edit
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <Clock className='w-5 h-5 text-gray-400' />
            <div>
              <p className='text-sm text-gray-500'>Earliest Pickup</p>
            </div>
          </div>
        </div>

        {/* Product Grid Section */}
        <div className='w-full px-4 py-4 grid grid-cols-2 gap-4'>
          {productCategories.map(item => (
            <div
              key={item._id}
              className='relative rounded-lg overflow-hidden shadow group'
              onClick={() => handleProduct(item._id, item.productName)}
            >
              <img
                src={`${ImagePath}${item.product_img[0]}`}
                alt={item.productName}
                className='w-full h-56 object-cover'
              />
              <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
                <h3 className='text-white font-bold text-lg text-center'>
                  {item.productName}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Select Location Button */}
        <div className='p-4 mt-auto'>
          <button
            className='w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors'
            onClick={goToCart}
          >
            Select your location
          </button>
        </div>
      </div>
    </>
  )
}

export default FoodDeliveryApp
