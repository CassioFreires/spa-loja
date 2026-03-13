import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User, ShoppingCart, Menu as MenuIcon, ShieldCheck } from 'lucide-react'

import SearchBar from '../../searchs/SearchBar'
import NavBar from '../../NavBar/NavBar'
import ProfileDropdown from '../../ProfileDropdown/ProfileDropdown'

import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/CartContext'

interface HeaderProps {
  onToggleAdminMenu?: () => void
}

const Header = ({ onToggleAdminMenu }: HeaderProps) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { totalItems } = useCart()
  const { user, isAuthenticated } = useAuth()

  const location = useLocation()
  const profileRef = useRef<HTMLDivElement | null>(null)

  /*
  -----------------------------------------
  SCROLL PERFORMANCE (throttle)
  -----------------------------------------
  */
  const handleScroll = useCallback(() => {
    const scroll = window.scrollY > 20
    setIsScrolled(scroll)
  }, [])

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [handleScroll])

  /*
  -----------------------------------------
  CLOSE MENUS ON ROUTE CHANGE
  -----------------------------------------
  */
  useEffect(() => {
    setMobileMenuOpen(false)
    setIsProfileOpen(false)
  }, [location])

  /*
  -----------------------------------------
  CLICK OUTSIDE PROFILE
  -----------------------------------------
  */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  /*
  -----------------------------------------
  SAFE ORIGIN (SSR SAFE)
  -----------------------------------------
  */
  const siteOrigin =
    typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <header
      role="banner"
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md shadow-2xl'
          : 'bg-black'
      }`}
    >
      <div className="relative z-10 w-full">

        {/* TOP BAR */}
        <div className="hidden md:flex w-full bg-zinc-900/50 border-b border-white/5 py-2">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} className="text-yellow-500" />
                Site 100% Seguro
              </div>
            </div>

            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest italic">
              Qualidade Tailandesa 1:1 • Envio para todo Brasil
            </span>
          </div>
        </div>

        {/* MAIN HEADER */}
        <div className="w-full py-3 md:py-5 px-4 md:px-6 lg:px-8">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 md:gap-8">

            {/* MOBILE MENU BUTTON */}
            <button
              aria-label="Abrir menu"
              aria-expanded={isMobileMenuOpen}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition active:scale-90"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon className="w-7 h-7" />
            </button>

            {/* LOGO */}
            <Link
              to="/"
              aria-label="Ir para página inicial"
              className="flex-shrink-0 flex items-center transition-transform active:scale-95 duration-300"
            >
              <img
                src="/assets/images/logo.png"
                alt="Logo Gold Store Multimarcas"
                className="h-10 md:h-14 lg:h-16 w-auto object-contain"
                loading="eager"
                fetchPriority="high"
              />
            </Link>

            {/* SEARCH DESKTOP */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <SearchBar />
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 md:gap-5">

              {/* PROFILE */}
              <div ref={profileRef} className="relative">

                {!isAuthenticated ? (
                  <div className="flex items-center gap-3">

                    <Link
                      to="/login"
                      aria-label="Entrar"
                      className="p-2.5 bg-yellow-500 text-black hover:bg-white rounded-2xl transition shadow active:scale-90"
                    >
                      <User className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
                    </Link>

                    <div className="hidden xl:flex flex-col leading-tight">
                      <Link
                        to="/cadastre-se"
                        className="text-[9px] text-zinc-500 font-black uppercase tracking-widest hover:text-yellow-500"
                      >
                        Olá, Cadastre-se
                      </Link>

                      <Link
                        to="/login"
                        className="text-[13px] text-white font-black uppercase tracking-tighter hover:text-yellow-500"
                      >
                        Minha Conta
                      </Link>
                    </div>

                  </div>
                ) : (
                  <div className="flex items-center gap-3">

                    <button
                      aria-label="Abrir perfil"
                      aria-expanded={isProfileOpen}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className={`p-2.5 rounded-2xl transition shadow border ${
                        isProfileOpen
                          ? 'bg-yellow-500 text-black border-yellow-500'
                          : 'bg-white/5 text-yellow-500 border-white/10 hover:border-yellow-500/50'
                      }`}
                    >
                      <User className="w-6 h-6 md:w-7 md:h-7 stroke-[2]" />
                    </button>

                    <div
                      className="hidden lg:flex flex-col cursor-pointer"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                      <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                        Bem-vindo,
                      </span>

                      <span className="text-[13px] text-white font-black uppercase tracking-tighter truncate max-w-[100px]">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </div>

                    <ProfileDropdown
                      isOpen={isProfileOpen}
                      onClose={() => setIsProfileOpen(false)}
                    />
                  </div>
                )}
              </div>

              {/* CART */}
              <Link
                to="/carrinho"
                aria-label="Carrinho"
                className="relative p-2.5 bg-white/5 hover:bg-zinc-800 rounded-2xl transition group shadow active:scale-90"
              >
                <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-yellow-500 transition-colors" />

                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-lg bg-yellow-500 text-[10px] md:text-[11px] font-black text-black ring-[3px] ring-black">
                    {totalItems}
                  </span>
                )}
              </Link>

            </div>
          </div>
        </div>

        {/* NAVBAR */}
        <NavBar
          isOpen={isMobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onToggleAdminMenu={onToggleAdminMenu}
        />

        {/* MOBILE SEARCH */}
        <div className="md:hidden bg-black px-4 pb-4">
          <SearchBar />
        </div>
      </div>

      {/* SEO JSON LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Gold Store Multimarcas",
            url: siteOrigin,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteOrigin}/busca?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </header>
  )
}

export default memo(Header)