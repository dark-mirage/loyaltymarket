'use client'
import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProfileHeader from '../../components/profile/ProfileHeader';
import MenuSection from '../../components/profile/ProfileMenuSection';

export default function ProfilePage() {

  const SettingsIcon = () => (
    <img src="/icons/profile/settings-icon.svg" alt="" className="w-6 h-6" />
  );

  const ChatIcon = () => (
    <img src="/icons/profile/chat-icon.svg" alt="" className="w-6 h-6" />
  );

  const OrdersIcon = () => (
    <img src="/icons/profile/orders-icon.svg" alt="" className="w-6 h-6" />
  );

  const BagIcon = () => (
    <img src="/icons/profile/bag-icon.svg" alt="" className="w-6 h-6" />
  );

  const UndoIcon = () => (
    <img src="/icons/profile/undo-icon.svg" alt="" className="w-6 h-6" />
  );

  const HomeIcon = () => (
    <img src="/icons/profile/home-icon.svg" alt="" className="w-6 h-6" />
  );

  const PointsIcon = () => (
    <img src="/icons/profile/points-icon.svg" alt="" className="w-6 h-6" />
  );

  const PeopleIcon = () => (
    <img src="/icons/profile/people-icon.svg" alt="" className="w-6 h-6" />
  );

  const PromoIcon = () => (
    <img src="/icons/profile/promo-icon.svg" alt="" className="w-6 h-6" />
  );

  const StarsIcon = () => (
    <img src="/icons/profile/stars-icon.svg" alt="" className="w-6 h-6" />
  );

  const HeartIcon = () => (
    <img src="/icons/profile/heart-icon.svg" alt="" className="w-6 h-6" />
  );

  const ViewedIcon = () => (
    <img src="/icons/profile/viewed-icon.svg" alt="" className="w-6 h-6" />
  );

  const InfoIcon = () => (
    <img src="/icons/profile/info-icon.svg" alt="" className="w-6 h-6" />
  );

  const AddToHomeIcon = () => (
    <img src="/icons/profile/home-icon.svg" alt="" className="w-6 h-6" />
  );

  return (
    <>
      <Header title="Профиль" />
      <main className="min-h-screen bg-white pb-20">
        <ProfileHeader avatar="/icons/profile/illustration/avatar.svg" name="Evgeny" />

        <div className="px-4 mb-4">
          <MenuSection items={[
            {
              text: 'Добавить на экран «Домой»',
              icon: <AddToHomeIcon />,
              href: '/add-to-home',
              fontWeight: 500,
            },
          ]} />
        </div>

        <div className="px-4 mb-4">
          <MenuSection
            items={[
              {
                text: 'Заказы',
                icon: <OrdersIcon />,
                href: '/orders',
                fontWeight: 500,
              },
              {
                text: 'Купленные товары',
                icon: <BagIcon />,
                href: '/purchased',
                fontWeight: 500,
              },
              {
                text: 'Возвраты',
                icon: <UndoIcon />,
                href: '/returns',
                fontWeight: 500,
              },
            ]}
          />
        </div>

        {/* Секция: Баллы */}
        <div className="px-4 mb-4">
          <MenuSection
            items={[
              {
                text: 'Баллы',
                icon: <PointsIcon />,
                href: '/promo',
                fontWeight: 500,
              },
              {
                text: 'Пригласить друзей',
                icon: <PeopleIcon />,
                href: '/invite-friends',
                fontWeight: 500,
              },
              {
                text: 'Промокоды',
                icon: <PromoIcon />,
                href: '/promocodes',
                fontWeight: 500,
                badge: 5,
              },
            ]}
          />
        </div>

        {/* Секция: Отзывы */}
        <div className="px-4 mb-4">
          <MenuSection
            items={[
              {
                text: 'Отзывы',
                icon: <StarsIcon />,
                href: '/reviews',
                fontWeight: 500,
              },
              {
                text: 'Избранное',
                icon: <HeartIcon />,
                href: '/favorites',
                fontWeight: 500,
              },
              {
                text: 'Просмотренное',
                icon: <ViewedIcon />,
                href: '/profile/viewed',
                fontWeight: 500,
              },
            ]}
          />
        </div>
        <div className="px-4 mb-4">
          <MenuSection items={[
            {
              text: 'Настройки',
              icon: <SettingsIcon />,
              href: '/settings',
              fontWeight: 500,
            },
            {
              text: 'О сервисе',
              icon: <InfoIcon />,
              // icon: <LogoutIcon />,
              href: '/logout',
              fontWeight: 500,
            },
            {
              text: 'чат с поддержкой',
              icon: <ChatIcon />,
              href: '/support',
              fontWeight: 500,
            },
          ]} />
        </div>
      </main>
      <Footer />
    </>
  );
}

