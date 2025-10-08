import React from 'react'
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Menu,
  ShoppingBag,
  Search,
  User
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import heroImage from '../../assets/concept.jpg'
import { useCart } from '../../Context/CartContext'
import { ImagePath } from '../../Services/Apiservice'

const ShoppingCartPage = () => {
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleGotocheckout = () => {
    const guestUserId = localStorage.getItem('guestUserId')
    const registredUserId = localStorage.getItem('registredUserId')

    if (guestUserId || registredUserId) {
      navigate('/placeorder')
    } else {
      navigate('/login')
    }
  }

  const handleMenuClick = () => {
    navigate('/menu')
  }

  const handleshoopingcartClick = () => {
    navigate('/shoopingcart')
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen'>
      {/* Left Sidebar (40% on desktop, full on mobile) */}
      <div className='w-full md:w-2/5 min-h-screen border-r border-gray-200 flex flex-col'>
        {/* Header */}
        <div className='p-2 border-b border-gray-200'>
          <div className='flex items-center justify-between mb-1'>
            <button
              onClick={() => navigate(-1)}
              className='p-2 hover:bg-gray-200 rounded-full transition-colors'
            >
              <ArrowLeft className='w-5 h-5 text-gray-600' />
            </button>

            <h1 className='text-2xl font-semibold text-gray-900 text-center flex-1'>
              Shopping Cart
            </h1>

            <div className='w-9' />
          </div>
        </div>

        {/* Promotions Section */}
        <div className='p-4 border-b border-gray-200'>
          <h2 className='text-lg font-medium text-gray-900 mb-3'>Promotions</h2>
          <div className='flex space-x-2'>
            <input
              type='text'
              placeholder='Enter promotion code'
              className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button className='px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors'>
              Apply
            </button>
          </div>
        </div>

        {/* Items Section */}
        <div className='p-4 flex-1 overflow-y-auto'>
          <h2 className='text-lg font-medium text-gray-900 mb-3'>Items</h2>

          {cart.length === 0 ? (
            // Empty Cart State
            <div className='text-center py-8'>
              <ShoppingCart className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <p className='text-gray-600 mb-2'>Your cart is empty.</p>
              <p className='text-gray-500 text-sm mb-6'>
                Add some items to your cart.
              </p>
              <button
                onClick={() => navigate('/')}
                className='px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Start Shopping
              </button>
            </div>
          ) : (
            // Cart Items List
            <div className='space-y-4'>
              {cart.map(item => (
                <div
                  key={item._id}
                  className='flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0'
                >
                  {/* Product Image */}
                  <img
                    src={`${ImagePath}${item.image}`}
                    alt={item.name}
                    className='w-20 h-20 object-cover rounded-md'
                  />

                  {/* Name & Price */}
                  <div className='flex-1 flex flex-col justify-center px-4'>
                    <h2 className='text-lg font-semibold'>{item.name}</h2>
                    <span className='text-red-500 font-bold'>
                      {item.price} KD
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className='flex items-center border border-gray-300 rounded-lg'>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      className='p-2 hover:bg-gray-100 transition-colors'
                    >
                      <Minus className='w-4 h-4' />
                    </button>
                    <span className='px-3 py-1 min-w-8 text-center'>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      className='p-2 hover:bg-gray-100 transition-colors'
                    >
                      <Plus className='w-4 h-4' />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className='p-2 rounded-full hover:bg-red-100 transition-colors ml-4'
                    title='Remove item'
                  >
                    <Trash2 className='w-4 h-4 text-red-500' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary - Only show when cart has items */}
        <div
          className='p-3 border-t border-gray-200 bg-white'
          onClick={handleGotocheckout}
        >
          <button className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-between px-6'>
            {/* Left - Items Count */}
            <div className='flex items-center'>
              <span className='bg-white/20 rounded-sm w-6 h-6 flex items-center justify-center text-sm'>
                {cart.length}
              </span>
            </div>

            {/* Center - Review Order Text */}
            <span>Go to checkout</span>

            {/* Right - Total Price */}
            <span>
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(3)}{' '}
              KD
            </span>
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div className='flex-1 relative bg-black'>
        {/* Top Navigation — hidden on mobile */}
        <div className='hidden md:absolute md:top-6 md:left-6 md:right-6 md:z-10 md:block'>
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

        {/* Hero Section — hidden on mobile */}
        <div className='hidden md:block relative h-screen'>
          <img
            src={heroImage}
            alt='Hero Food'
            className='w-full h-full object-cover'
          />

          {/* Bottom IG button */}
          <div className='absolute bottom-8 left-8 z-20'>
            <div className='w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
              IG
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShoppingCartPage
