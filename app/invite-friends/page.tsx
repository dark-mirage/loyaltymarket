import Link from "next/link";
import Footer from "../../components/layout/Footer";
import { X, Check, Minus } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import { invitedUsers, stats } from "./mock";
import { cn } from "../shared";
import Container from "../../components/layout/Layout";
import Header from "../../components/layout/Header";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Зовите друзей и получайте скидку",
  description:
    "Пригласите друзей и получите скидку. Уникальная ссылка для приглашения в приложение.",
  mainEntity: {
    "@type": "Offer",
    name: "Скидка за приглашение друзей",
    description:
      "Пригласите 3 друзей в приложение и получите промокод на скидку 10%",
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      value: 3,
      unitText: "друзья",
    },
    price: "0",
    priceCurrency: "RUB",
  },
  interactionStatistic: [
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ClickAction",
      name: "Переходы по ссылке",
      userInteractionCount: stats.visited,
    },
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ActivateAction",
      name: "Запуски приложения",
      userInteractionCount: stats.started,
    },
    {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/ReceiveAction",
      name: "Полученные промокоды",
      userInteractionCount: stats.promocodes,
    },
  ],
};

export default function InviteFriends() {
  return (
    <main
      className="max-w-100.5 pt-0 pb-20 mx-auto"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header title="Зовите друзей"></Header>

      {/* Иконки приглашений: 3 слева, 3 справа, 1 по центру */}
      <div className="relative h-20 mb-40 pointer-events-none ">
        {/* Левый столбец: первые три слева */}
        <img
          src="/icons/invite-friends/1-avatar.svg"
          alt=""
          className="absolute left-22 top-2 w-[51px] h-[51px]"
        />
        <img
          src="/icons/invite-friends/2-avatar.svg"
          alt=""
          className="absolute left-12 top-20 w-[50px] h-[50px]"
        />
        <img
          src="/icons/invite-friends/3-avatar.svg"
          alt=""
          className="absolute left-23 top-38 w-[54px] h-[53px]"
        />

        {/* Правый столбец: 4-5-6 справа */}
        <img
          src="/icons/invite-friends/4-avatar.svg"
          alt=""
          className="absolute right-20 top-5 w-[50px] h-[50px]"
        />
        <img
          src="/icons/invite-friends/5-avatar.svg"
          alt=""
          className="absolute right-12 top-24 w-[55px] h-[55px]"
        />
        <img
          src="/icons/invite-friends/6-avatar.svg"
          alt=""
          className="absolute right-25 top-39 w-[50px] h-[50px]"
        />

        {/* Центр: 7 */}
        <img
          src="/icons/invite-friends/7-avatar.svg"
          alt=""
          className="absolute left-1/2 transform -translate-x-1/2 top-13 w-[100px] h-[100px]"
        />
      </div>

      <Container>
        <section>
          <h1
            className="mb-6.5 text-[1.563rem] font-bold pt-0 leading-7"
            itemProp="name"
          >
            Зовите друзей и <br />
            получайте скидку
          </h1>

          <p
            className="text-400 leading-5 mb-6.5"
            itemProp="description"
          >
            Пригласите в приложение 3 друзей по своей ссылке и мы подарим вам
            промокод на скидку 10%.
          </p>
        </section>

        <section
          aria-labelledby="invite-link"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <h3
            id="invite-link"
            className="text-xl leading-6 font-bold mb-4"
            itemProp="name"
          >
            Ваша ссылка для приглашений
          </h3>

          <meta itemProp="price" content="0" />
          <meta itemProp="priceCurrency" content="RUB" />

          <div className="flex flex-col items-center gap-3.25 mb-3">
          <div className="relative w-full">
              <input
                type="text"
                aria-label="Ссылка для приглашения"
                value="https://t.me/loyaltymarketbot?start=707635394"
                readOnly
                className="min-h-13.75 w-full p-4.25 pr-14 rounded-2xl text-[0.9375rem] bg-[#F4F3F1] border-none"
              />

              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <img src="/icons/invite-friends/copy.svg" alt="copy-icon" />
              </button>
            </div>


            <button
              type="button"
              aria-label="Поделиться ссылкой"
              className="p-4.25 w-full bg-[#2D2D2D] text-white text-[0.9375rem] font-medium rounded-2xl hover:bg-gray-300 transition-colors"
            >
              Поделиться
            </button>
          </div>
        </section>

        <section
          aria-labelledby="stats"
          className="bg-[#F4F3F1] rounded-2xl px-5.5 pt-6.25 pb-5.25 mb-6.25"
        >
          <h3 id="stats" className="sr-only">
            Статистика
          </h3>

          <div className="space-y-1.5">
            <div
              className="flex justify-between text-base"
              itemProp="interactionStatistic"
            >
              <span>Перешли по ссылке</span>
              <strong>{stats.visited}</strong>
            </div>

            <div
              className="flex justify-between text-base"
              itemProp="interactionStatistic"
            >
              <span>Запустили приложение</span>
              <strong>{stats.started}</strong>
            </div>

            <div
              className="flex justify-between text-base"
              itemProp="interactionStatistic"
            >
              <span>Получено промокодов</span>
              <strong>{stats.promocodes}</strong>
            </div>
          </div>
        </section>

        <section aria-labelledby="invite-history" className="mb-10">
          <h3
            id="invite-history"
            className="text-xs text-[#7E7E7E] font-semibold mb-4"
          >
            История приглашений
          </h3>

          <div className="flex flex-col gap-2.25">
            {invitedUsers.map((user) => (
              <article
                key={user.id}
                className="flex min-h-13.25"
                itemScope
                itemType="https://schema.org/Person"
              >
                <Image
                  src={user.avatar}
                  alt={`Аватар пользователя ${user.name}`}
                  className="w-11 h-11 rounded-full mr-3 mb-auto"
                  width={44}
                  height={44}
                  itemProp="image"
                />

                <div className="flex flex-1 justify-between border-b-[0.03125rem] border-[#CDCDCD]">
                  <div className="h-full flex-1">
                    <div
                      className="text-[0.9375rem] font-medium text-[#7E7E7E]"
                      itemProp="name"
                    >
                      {user.name}
                    </div>

                    <div className="text-xs text-[#7E7E7E]">
                      {user.date}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center text-sm font-medium">
                    <span aria-hidden="true" className="ml-auto">
                      {user.status === "Уже пользуется" ? (
                        <Minus size={20} />
                      ) : (
                        <Check size={18} />
                      )}
                    </span>

                    <span className={cn("text-[#7E7E7E] text-xs mb-3")}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Footer />
      </Container>
    </main>
  );
}

