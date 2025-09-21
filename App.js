const { useState, useEffect } = React

// UI minimal components (replacing missing '@/components/ui/*')
const Button = ({ children, className = '', variant = 'default', size = 'md', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md border transition-colors'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
    outline: 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-5 py-2.5 text-lg' }
  return React.createElement('button', {
    className: `${base} ${variants[variant]} ${sizes[size]} ${className}`,
    ...props
  }, children)
}

const Card = ({ children, className = '', ...props }) => 
  React.createElement('div', { className: `bg-white rounded-lg shadow ${className}`, ...props }, children)

// Optimized Image Component with lazy loading
const OptimizedImage = ({ src, alt, className = '', ...props }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  
  return React.createElement('div', { className: `relative bg-gray-200 ${className}`, ...props },
    !loaded && !error && React.createElement('div', { className: "absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse" },
      React.createElement('div', { className: "w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" })
    ),
    error && React.createElement('div', { className: "absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500" },
      React.createElement('span', null, "📷")
    ),
    React.createElement('img', {
      src: src,
      alt: alt,
      className: `w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`,
      loading: "lazy",
      onLoad: () => setLoaded(true),
      onError: () => setError(true)
    })
  )
}

// Optimized Audio Component with fallbacks
const OptimizedAudio = ({ src, className = '', ...props }) => {
  const [audioState, setAudioState] = useState('loading') // loading, ready, error, playing
  const [fallbackIndex, setFallbackIndex] = useState(0)
  
  // Generate fallback URLs for different formats and paths
  const generateFallbacks = (originalSrc) => {
    const fallbacks = [originalSrc]
    
    // Try different path variations
    if (originalSrc.includes('/Audio/')) {
      const fileName = originalSrc.split('/').pop()
      const baseName = fileName.replace(/\.[^/.]+$/, '')
      
      // Try different path formats for Netlify with public folder
      fallbacks.push(`./public/Audio/${fileName}`)
      fallbacks.push(`public/Audio/${fileName}`)
      fallbacks.push(`/public/Audio/${fileName}`)
      fallbacks.push(`/Audio/${fileName}`) // Fallback for direct access
      
      // Try with different encodings
      fallbacks.push(`/public/Audio/${encodeURIComponent(fileName)}`)
      fallbacks.push(`/public/Audio/${encodeURI(fileName)}`)
      
      // Try with base URL (for Netlify)
      const baseUrl = window.location.origin
      fallbacks.push(`${baseUrl}/public/Audio/${fileName}`)
      fallbacks.push(`${baseUrl}/Audio/${fileName}`) // Fallback
      
      // Try different formats (if not already MP3)
      if (!fileName.toLowerCase().endsWith('.mp3')) {
        fallbacks.push(`/public/Audio/${baseName}.mp3`)
        fallbacks.push(`${baseUrl}/public/Audio/${baseName}.mp3`)
      }
    }
    
    return [...new Set(fallbacks)] // Remove duplicates
  }
  
  const fallbacks = generateFallbacks(src)
  const currentSrc = fallbacks[fallbackIndex]
  
  const handleError = () => {
    console.log(`Erro no áudio ${currentSrc}, tentando próximo fallback...`)
    
    if (fallbackIndex < fallbacks.length - 1) {
      setFallbackIndex(fallbackIndex + 1)
      setAudioState('loading')
    } else {
      console.error('Todos os fallbacks de áudio falharam')
      setAudioState('error')
    }
  }
  
  const handleCanPlay = () => {
    console.log(`Áudio carregado com sucesso: ${currentSrc}`)
    setAudioState('ready')
  }
  
  const handleLoadStart = () => {
    console.log(`Iniciando carregamento: ${currentSrc}`)
    setAudioState('loading')
  }
  
  if (audioState === 'error') {
    return React.createElement('div', { className: `bg-gray-100 border border-gray-300 rounded-lg p-4 ${className}` },
      React.createElement('div', { className: "flex items-center gap-2 text-gray-600" },
        React.createElement('span', null, "🔇"),
        React.createElement('span', { className: "text-sm" }, "Áudio não disponível")
      ),
      React.createElement('button', {
        onClick: () => {
          setFallbackIndex(0)
          setAudioState('loading')
        },
        className: "mt-2 text-xs text-blue-600 hover:text-blue-800"
      }, "Tentar novamente")
    )
  }
  
  return React.createElement('div', { className: `relative ${className}` },
    audioState === 'loading' && React.createElement('div', { className: "absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center" },
      React.createElement('div', { className: "flex items-center gap-2 text-gray-600" },
        React.createElement('div', { className: "w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" }),
        React.createElement('span', { className: "text-sm" }, "Carregando áudio...")
      )
    ),
    React.createElement('audio', {
      controls: true,
      preload: "metadata",
      src: currentSrc,
      className: "w-full",
      playsInline: true,
      crossOrigin: "anonymous",
      onError: handleError,
      onCanPlay: handleCanPlay,
      onLoadStart: handleLoadStart,
      onPlay: () => setAudioState('playing'),
      onPause: () => setAudioState('ready'),
      ...props
    },
      React.createElement('source', { src: currentSrc, type: "audio/mpeg" }),
      React.createElement('source', { src: currentSrc.replace('.mp3', '.ogg'), type: "audio/ogg" }),
      React.createElement('source', { src: currentSrc.replace('.mp3', '.wav'), type: "audio/wav" }),
      "Seu navegador não suporta o elemento de áudio."
    ),
    fallbackIndex > 0 && React.createElement('div', { className: "text-xs text-gray-500 mt-1" },
      `Usando fallback ${fallbackIndex + 1} de ${fallbacks.length}`
    )
  )
}

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('countries')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [visited, setVisited] = useState([])
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data_structure.json')
        const jsonData = await response.json()
        setData(jsonData)
        
        // Load favorites and visited from localStorage
        const savedFavorites = localStorage.getItem('apptravel_favorites')
        const savedVisited = localStorage.getItem('apptravel_visited')
        
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
        }
        if (savedVisited) {
          setVisited(JSON.parse(savedVisited))
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Save favorites and visited to localStorage
  useEffect(() => {
    localStorage.setItem('apptravel_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('apptravel_visited', JSON.stringify(visited))
  }, [visited])

  // Image resolution heuristics
  const buildImageCandidates = (cityName, activityName) => {
    const candidates = []
    
    // Clean names for file matching
    const cleanCity = cityName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const cleanActivity = activityName.replace(/[^a-zA-Z0-9]/g, '')
    
    // Common keywords mapping
    const commonKeywords = {
      'duomo': ['duomo', 'catedral', 'cathedral', 'basilica'],
      'coliseu': ['coliseu', 'colosseum', 'anfiteatro'],
      'panteao': ['panteao', 'pantheon', 'panteon'],
      'fontana': ['fontana', 'fonte', 'fountain'],
      'piazza': ['piazza', 'praca', 'square'],
      'museu': ['museu', 'museum', 'musei'],
      'palazzo': ['palazzo', 'palace', 'palacio'],
      'torre': ['torre', 'tower', 'torre'],
      'ponte': ['ponte', 'bridge', 'ponte'],
      'galleria': ['galleria', 'gallery', 'galeria'],
      'basilica': ['basilica', 'basilica', 'basilica'],
      'teatro': ['teatro', 'theater', 'theatre'],
      'castelo': ['castelo', 'castle', 'castillo'],
      'termas': ['termas', 'baths', 'thermae'],
      'forum': ['forum', 'foro', 'foro'],
      'monte': ['monte', 'hill', 'mont'],
      'via': ['via', 'road', 'street'],
      'catacumbas': ['catacumbas', 'catacombs', 'catacombe'],
      'escadaria': ['escadaria', 'stairs', 'scalinata'],
      'circo': ['circo', 'circus', 'circo'],
      'ultimaceia': ['ultimaceia', 'ultimaceia', 'ultimaceia']
    }
    
    // City-specific overrides
    const perCity = {
      'ROMA': {
        overrides: {
          'Catacumbas de Roma': ['catacumbas'],
          'Escadaria da Praça de Espanha': ['EscadariadaPracadeEspanha', 'EscadariadaPracaDeEspanha'],
          'Via Ápia Antiga': ['ViaApiaAntiga', 'ViaApia'],
          'Circo Máximo': ['Circomaximo', 'CircoMaximo'],
          'Fórum Romano': ['ForumRomano', 'Forum'],
          'Monte Palatino': ['MontePalatino', 'Palatino'],
          'Panteão': ['Pantao', 'Panteao'],
          'Basílica de São Pedro': ['BasilicadeSaoPedro', 'BasilicaSaoPedro'],
          'Castel Sant\'Angelo': ['CastelSantAngelo', 'CastelSantAngelo'],
          'Piazza Navona': ['PiazzaNavona', 'Navona'],
          'Termas de Caracalla': ['TermasdeCaracalla', 'Caracalla'],
          'Museus Capitolinos': ['MuseusCapitolinos', 'Capitolinos'],
          'Palazzo Barberini': ['PalazzoBarberini', 'Barberini'],
          'Museus do Vaticano': ['MuseusdoVaticano', 'Vaticano'],
          'Fontana di Trevi': ['FontanadiTrevi', 'Trevi']
        }
      },
      'FLORENCA': {
        overrides: {
          'Duomo de Florença': ['Duomo'],
          'Galleria degli Uffizi': ['GaleriDegliUffizi', 'Uffizi'],
          'Ponte Vecchio': ['PonteVecchio', 'Ponte'],
          'Palazzo Pitti': ['PalazzoPitti', 'Pitti'],
          'Galleria dell\'Accademia': ['GalleriaDellAcademia', 'Accademia'],
          'Piazza San Giovanni': ['PiazzaSangiovanni', 'Sangiovanni'],
          'Palazzo Vecchio': ['PalazzoVecchio', 'Vecchio'],
          'Basílica de San Lorenzo': ['BasilicaDeSanLorenzo', 'SanLorenzo'],
          'Basílica di Santa Croce': ['BasilicaDeSantaCroce', 'SantaCroce'],
          'Piazzale Michelangelo': ['PiazzaleMichelangelo', 'Michelangelo']
        }
      },
      'MILAO': {
        overrides: {
          'Duomo de Milão': ['Duomo'],
          'Galleria Vittorio Emanuele II': ['GalleriaVittorioEmanueleII', 'Galleria'],
          'Teatro Alla Scala': ['TeatroAllaScala', 'Scala'],
          'A Última Ceia': ['UltimaCeia', 'ultimaceia', 'UltimaCeia', 'ULTIMACEIA'],
          'Castello Sforzesco': ['CastelloSforzesco', 'Sforzesco']
        }
      },
      'PISA': {
        overrides: {
          'Catedral de Pisa': ['CatedralDePisa', 'Catedral'],
          'Torre de Pisa': ['TorreDePisa', 'Torre'],
          'Batistério de Pisa': ['BatisterioDePisa', 'Batisterio']
        }
      },
      'SANGIMIGNANO': {
        overrides: {
          'Duomo de San Gimignano': ['DuomodeSanGimignano', 'Duomo'],
          'Piazza della Cisterna': ['PiazzadellaCisterna', 'Cisterna'],
          'Torre Grossa': ['TorreGrossa', 'Torre'],
          'Palazzo Comunale': ['PalazzoComunale', 'Comunale']
        }
      },
      'SIENA': {
        overrides: {
          'Duomo de Siena': ['DuomodeSiena', 'Duomo'],
          'Piazza del Campo': ['PiazzadelCampo', 'Campo'],
          'Torre del Mangia': ['TorreDelMangia', 'Mangia']
        }
      }
    }
    
    // Get city-specific overrides
    const cityOverrides = perCity[cleanCity]?.overrides || {}
    const activityOverrides = cityOverrides[activityName] || []
    
    // Add overrides first (highest priority)
    activityOverrides.forEach(override => {
      candidates.push(`/public/Images/${cleanCity}_${override}.jpg`)
      candidates.push(`/public/Images/${cleanCity}_${override}.jpeg`)
      candidates.push(`/public/Images/${cleanCity}_${override}.png`)
      candidates.push(`/public/Images/${cleanCity}_${override}.webp`)
    })
    
    // Add common keyword variations
    Object.entries(commonKeywords).forEach(([keyword, variations]) => {
      if (activityName.toLowerCase().includes(keyword)) {
        variations.forEach(variation => {
          candidates.push(`/public/Images/${cleanCity}_${variation}.jpg`)
          candidates.push(`/public/Images/${cleanCity}_${variation}.jpeg`)
          candidates.push(`/public/Images/${cleanCity}_${variation}.png`)
          candidates.push(`/public/Images/${cleanCity}_${variation}.webp`)
        })
      }
    })
    
    // Add generic variations
    candidates.push(`/public/Images/${cleanCity}_${cleanActivity}.jpg`)
    candidates.push(`/public/Images/${cleanCity}_${cleanActivity}.jpeg`)
    candidates.push(`/public/Images/${cleanCity}_${cleanActivity}.png`)
    candidates.push(`/public/Images/${cleanCity}_${cleanActivity}.webp`)
    
    // Add fallback to generic city image
    candidates.push(`/public/Images/${cleanCity}.jpg`)
    candidates.push(`/public/Images/${cleanCity}.jpeg`)
    candidates.push(`/public/Images/${cleanCity}.png`)
    
    return [...new Set(candidates)] // Remove duplicates
  }

  // Audio resolution heuristics
  const buildAudioCandidates = (cityName, activityName) => {
    const candidates = []
    
    // Clean names for file matching
    const cleanCity = cityName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    const cleanActivity = activityName.replace(/[^a-zA-Z0-9]/g, '')
    
    // City-specific overrides (same as images)
    const perCity = {
      'ROMA': {
        overrides: {
          'Catacumbas de Roma': ['catacumbas'],
          'Escadaria da Praça de Espanha': ['EscadariadaPracadeEspanha', 'EscadariadaPracaDeEspanha'],
          'Via Ápia Antiga': ['ViaApiaAntiga', 'ViaApia'],
          'Circo Máximo': ['Circomaximo', 'CircoMaximo'],
          'Fórum Romano': ['ForumRomano', 'Forum'],
          'Monte Palatino': ['MontePalatino', 'Palatino'],
          'Panteão': ['Pantao', 'Panteao'],
          'Basílica de São Pedro': ['BasilicadeSaoPedro', 'BasilicaSaoPedro'],
          'Castel Sant\'Angelo': ['CastelSantAngelo', 'CastelSantAngelo'],
          'Piazza Navona': ['PiazzaNavona', 'Navona'],
          'Termas de Caracalla': ['TermasdeCaracalla', 'Caracalla'],
          'Museus Capitolinos': ['MuseusCapitolinos', 'Capitolinos'],
          'Palazzo Barberini': ['PalazzoBarberini', 'Barberini'],
          'Museus do Vaticano': ['MuseusdoVaticano', 'Vaticano'],
          'Fontana di Trevi': ['FontanadiTrevi', 'Trevi']
        }
      },
      'FLORENCA': {
        overrides: {
          'Duomo de Florença': ['Duomo'],
          'Galleria degli Uffizi': ['GaleriDegliUffizi', 'Uffizi'],
          'Ponte Vecchio': ['PonteVecchio', 'Ponte'],
          'Palazzo Pitti': ['PalazzoPitti', 'Pitti'],
          'Galleria dell\'Accademia': ['GalleriaDellAcademia', 'Accademia'],
          'Piazza San Giovanni': ['PiazzaSangiovanni', 'Sangiovanni'],
          'Palazzo Vecchio': ['PalazzoVecchio', 'Vecchio'],
          'Basílica de San Lorenzo': ['BasilicaDeSanLorenzo', 'SanLorenzo'],
          'Basílica di Santa Croce': ['BasilicaDeSantaCroce', 'SantaCroce'],
          'Piazzale Michelangelo': ['PiazzaleMichelangelo', 'Michelangelo']
        }
      },
      'MILAO': {
        overrides: {
          'Duomo de Milão': ['Duomo'],
          'Galleria Vittorio Emanuele II': ['GalleriaVittorioEmanueleII', 'Galleria'],
          'Teatro Alla Scala': ['TeatroAllaScala', 'Scala'],
          'A Última Ceia': ['UltimaCeia', 'ultimaceia', 'UltimaCeia', 'ULTIMACEIA'],
          'Castello Sforzesco': ['CastelloSforzesco', 'Sforzesco']
        }
      },
      'PISA': {
        overrides: {
          'Catedral de Pisa': ['CatedralDePisa', 'Catedral'],
          'Torre de Pisa': ['TorreDePisa', 'Torre'],
          'Batistério de Pisa': ['BatisterioDePisa', 'Batisterio']
        }
      },
      'SANGIMIGNANO': {
        overrides: {
          'Duomo de San Gimignano': ['DuomodeSanGimignano', 'Duomo'],
          'Piazza della Cisterna': ['PiazzadellaCisterna', 'Cisterna'],
          'Torre Grossa': ['TorreGrossa', 'Torre'],
          'Palazzo Comunale': ['PalazzoComunale', 'Comunale']
        }
      },
      'SIENA': {
        overrides: {
          'Duomo de Siena': ['DuomodeSiena', 'Duomo'],
          'Piazza del Campo': ['PiazzadelCampo', 'Campo'],
          'Torre del Mangia': ['TorreDelMangia', 'Mangia']
        }
      }
    }
    
    // Get city-specific overrides
    const cityOverrides = perCity[cleanCity]?.overrides || {}
    const activityOverrides = cityOverrides[activityName] || []
    
    // Add overrides first (highest priority)
    activityOverrides.forEach(override => {
      candidates.push(`/public/Audio/${cleanCity}_${override}.mp3`)
    })
    
    // Add generic variations
    candidates.push(`/public/Audio/${cleanCity}_${cleanActivity}.mp3`)
    
    // Add fallback to generic city audio
    candidates.push(`/public/Audio/${cleanCity}.mp3`)
    
    return [...new Set(candidates)] // Remove duplicates
  }

  // Toggle favorite
  const toggleFavorite = (activity) => {
    const isFavorite = favorites.some(fav => fav.id === activity.id)
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== activity.id))
    } else {
      setFavorites([...favorites, activity])
    }
  }

  // Toggle visited
  const toggleVisited = (activity) => {
    const isVisited = visited.some(vis => vis.id === activity.id)
    if (isVisited) {
      setVisited(visited.filter(vis => vis.id !== activity.id))
    } else {
      setVisited([...visited, activity])
    }
  }

  // Get image source with fallbacks
  const getImageSrc = (cityName, activityName) => {
    const candidates = buildImageCandidates(cityName, activityName)
    return candidates[0] || '/public/Images/ITALIA.png'
  }

  // Get audio source with fallbacks
  const getAudioSrc = (cityName, activityName) => {
    const candidates = buildAudioCandidates(cityName, activityName)
    return candidates[0] || '/public/Audio/Roma.mp3'
  }

  if (loading) {
    return React.createElement('div', { className: "min-h-screen bg-gray-100 flex items-center justify-center" },
      React.createElement('div', { className: "text-center" },
        React.createElement('div', { className: "w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" }),
        React.createElement('h2', { className: "text-xl font-semibold text-gray-700" }, "Carregando guia de viagem...")
      )
    )
  }

  if (!data) {
    return React.createElement('div', { className: "min-h-screen bg-gray-100 flex items-center justify-center" },
      React.createElement('div', { className: "text-center" },
        React.createElement('h2', { className: "text-xl font-semibold text-red-600 mb-4" }, "Erro ao carregar dados"),
        React.createElement('button', {
          onClick: () => window.location.reload(),
          className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        }, "Tentar novamente")
      )
    )
  }

  // Countries view
  if (currentView === 'countries') {
    return React.createElement('div', { className: "min-h-screen bg-gray-100" },
      React.createElement('div', { className: "container mx-auto px-4 py-8" },
        React.createElement('h1', { className: "text-4xl font-bold text-center text-gray-800 mb-8" }, "🏛️ Guia de Viagem de Bolso"),
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
          data.countries.map(country => 
            React.createElement(Card, {
              key: country.id,
              className: "p-6 cursor-pointer hover:shadow-lg transition-shadow",
              onClick: () => {
                setSelectedCountry(country)
                setCurrentView('cities')
              }
            },
              React.createElement('div', { className: "text-center" },
                React.createElement('div', { className: "text-6xl mb-4" }, country.flag),
                React.createElement('h2', { className: "text-2xl font-bold text-gray-800 mb-2" }, country.name),
                React.createElement('p', { className: "text-gray-600" }, `${country.cities.length} cidades`)
              )
            )
          )
        )
      )
    )
  }

  // Cities view
  if (currentView === 'cities') {
    return React.createElement('div', { className: "min-h-screen bg-gray-100" },
      React.createElement('div', { className: "container mx-auto px-4 py-8" },
        React.createElement('div', { className: "flex items-center mb-8" },
          React.createElement('button', {
            onClick: () => setCurrentView('countries'),
            className: "mr-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          }, "← Voltar"),
          React.createElement('h1', { className: "text-4xl font-bold text-gray-800" }, `${selectedCountry.flag} ${selectedCountry.name}`)
        ),
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
          selectedCountry.cities.map(city => 
            React.createElement(Card, {
              key: city.id,
              className: "p-6 cursor-pointer hover:shadow-lg transition-shadow",
              onClick: () => {
                setSelectedCity(city)
                setCurrentView('activities')
              }
            },
              React.createElement('div', { className: "text-center" },
                React.createElement(OptimizedImage, {
                  src: getImageSrc(city.name, city.name),
                  alt: city.name,
                  className: "w-full h-48 mb-4 rounded-lg"
                }),
                React.createElement('h2', { className: "text-2xl font-bold text-gray-800 mb-2" }, city.name),
                React.createElement('p', { className: "text-gray-600" }, `${city.activities.length} atrações`)
              )
            )
          )
        )
      )
    )
  }

  // Activities view
  if (currentView === 'activities') {
    return React.createElement('div', { className: "min-h-screen bg-gray-100" },
      React.createElement('div', { className: "container mx-auto px-4 py-8" },
        React.createElement('div', { className: "flex items-center mb-8" },
          React.createElement('button', {
            onClick: () => setCurrentView('cities'),
            className: "mr-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          }, "← Voltar"),
          React.createElement('h1', { className: "text-4xl font-bold text-gray-800" }, selectedCity.name)
        ),
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" },
          selectedCity.activities.map(activity => 
            React.createElement(Card, {
              key: activity.id,
              className: "p-6 cursor-pointer hover:shadow-lg transition-shadow",
              onClick: () => {
                setSelectedActivity(activity)
                setCurrentView('activity-detail')
              }
            },
              React.createElement('div', { className: "text-center" },
                React.createElement(OptimizedImage, {
                  src: getImageSrc(selectedCity.name, activity.name),
                  alt: activity.name,
                  className: "w-full h-48 mb-4 rounded-lg"
                }),
                React.createElement('h2', { className: "text-xl font-bold text-gray-800 mb-2" }, activity.name),
                React.createElement('p', { className: "text-gray-600 text-sm" }, activity.description)
              )
            )
          )
        )
      )
    )
  }

  // Activity detail view
  if (currentView === 'activity-detail') {
    const isFavorite = favorites.some(fav => fav.id === selectedActivity.id)
    const isVisited = visited.some(vis => vis.id === selectedActivity.id)
    
    return React.createElement('div', { className: "min-h-screen bg-gray-100" },
      React.createElement('div', { className: "container mx-auto px-4 py-8" },
        React.createElement('div', { className: "flex items-center mb-8" },
          React.createElement('button', {
            onClick: () => setCurrentView('activities'),
            className: "mr-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          }, "← Voltar"),
          React.createElement('h1', { className: "text-4xl font-bold text-gray-800" }, selectedActivity.name)
        ),
        React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
          React.createElement('div', null,
            React.createElement(OptimizedImage, {
              src: getImageSrc(selectedCity.name, selectedActivity.name),
              alt: selectedActivity.name,
              className: "w-full h-96 rounded-lg mb-6"
            }),
            React.createElement('div', { className: "flex gap-4 mb-6" },
              React.createElement(Button, {
                onClick: () => toggleFavorite(selectedActivity),
                variant: isFavorite ? "default" : "outline"
              }, isFavorite ? "❤️ Favorito" : "🤍 Adicionar aos Favoritos"),
              React.createElement(Button, {
                onClick: () => toggleVisited(selectedActivity),
                variant: isVisited ? "default" : "outline"
              }, isVisited ? "✅ Visitado" : "📍 Marcar como Visitado")
            )
          ),
          React.createElement('div', null,
            React.createElement('h2', { className: "text-2xl font-bold text-gray-800 mb-4" }, "Descrição"),
            React.createElement('p', { className: "text-gray-700 mb-6" }, selectedActivity.description),
            React.createElement('h3', { className: "text-xl font-bold text-gray-800 mb-4" }, "Narração de Áudio"),
            React.createElement(OptimizedAudio, {
              src: getAudioSrc(selectedCity.name, selectedActivity.name),
              className: "mb-6"
            }),
            selectedActivity.hours && React.createElement('div', { className: "mb-4" },
              React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-2" }, "Horários"),
              React.createElement('p', { className: "text-gray-700" }, selectedActivity.hours)
            ),
            selectedActivity.price && React.createElement('div', { className: "mb-4" },
              React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-2" }, "Preços"),
              React.createElement('p', { className: "text-gray-700" }, selectedActivity.price)
            ),
            selectedActivity.location && React.createElement('div', { className: "mb-4" },
              React.createElement('h3', { className: "text-lg font-semibold text-gray-800 mb-2" }, "Localização"),
              React.createElement('p', { className: "text-gray-700" }, selectedActivity.location)
            )
          )
        )
      )
    )
  }

  return null
}

// Render the app
ReactDOM.render(React.createElement(App), document.getElementById('root'))
