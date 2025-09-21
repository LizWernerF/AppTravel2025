const { useState, useEffect } = React
// UI minimal components (replacing missing '@/components/ui/*')
const Button = ({ children, className = '', variant = 'default', size = 'md', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-md border transition-colors'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
    outline: 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-5 py-2.5 text-lg' }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow ${className}`} {...props}>{children}</div>
)

// Optimized Image Component with lazy loading
const OptimizedImage = ({ src, alt, className = '', ...props }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  
  return (
    <div className={`relative bg-gray-200 ${className}`} {...props}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500">
          <span>📷</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}

// Optimized Audio Component with fallbacks and mobile support
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
    return (
      <div className={`bg-gray-100 border border-gray-300 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-gray-600">
          <span>🔇</span>
          <span className="text-sm">Áudio não disponível</span>
        </div>
        <button 
          onClick={() => {
            setFallbackIndex(0)
            setAudioState('loading')
          }}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
        >
          Tentar novamente
        </button>
      </div>
    )
  }
  
  return (
    <div className={`relative ${className}`}>
      {audioState === 'loading' && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-sm">Carregando áudio...</span>
          </div>
        </div>
      )}
      
      <audio
        controls
        preload="metadata"
        src={currentSrc}
        className="w-full"
        playsInline
        webkit-playsinline="true"
        crossOrigin="anonymous"
        onError={handleError}
        onCanPlay={handleCanPlay}
        onLoadStart={handleLoadStart}
        onPlay={() => setAudioState('playing')}
        onPause={() => setAudioState('ready')}
        {...props}
      >
        <source src={currentSrc} type="audio/mpeg" />
        <source src={currentSrc.replace('.mp3', '.ogg')} type="audio/ogg" />
        <source src={currentSrc.replace('.mp3', '.wav')} type="audio/wav" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
      
      {fallbackIndex > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          Usando fallback {fallbackIndex + 1} de {fallbacks.length}
        </div>
      )}
    </div>
  )
}
const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
)
const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)
const CardTitle = ({ children, className = '' }) => (
  <h2 className={`font-semibold ${className}`}>{children}</h2>
)
const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 ${className}`}>{children}</p>
)
const Badge = ({ children, className = '', variant = 'secondary' }) => {
  const styles = variant === 'outline'
    ? 'border border-gray-300 text-gray-700'
    : 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-1 rounded text-xs ${styles} ${className}`}>{children}</span>
}
// Inline icon fallbacks (no bundler needed)
const Icon = ({ children, className = '' }) => (
  <span className={className} aria-hidden="true">{children}</span>
)
const ArrowLeft = (p) => <Icon {...p}>←</Icon>
const MapPin = (p) => <Icon {...p}>📍</Icon>
const Clock = (p) => <Icon {...p}>⏱️</Icon>
const Heart = (p) => <Icon {...p}>❤</Icon>
const Check = (p) => <Icon {...p}>✓</Icon>
const Star = (p) => <Icon {...p}>★</Icon>
const MapIcon = (p) => <Icon {...p}>🗺️</Icon>
const Download = (p) => <Icon {...p}>⬇️</Icon>

function App() {
  const [currentView, setCurrentView] = useState('countries') // countries, cities, activities, activity-detail, trips, trip-create, trip-detail
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [favorites, setFavorites] = useState(new Set())
  const [visited, setVisited] = useState(new Set())
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState('')
  const [data, setData] = useState(null)
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [tripActivitySearch, setTripActivitySearch] = useState('')
  const [selectedTripDayDate, setSelectedTripDayDate] = useState(null)
  const [lastTripContext, setLastTripContext] = useState(null) // { tripId, date }
  const [customEdit, setCustomEdit] = useState(null) // { date, index, value }

  // Load favorites and visited from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('travel-favorites')
    const savedVisited = localStorage.getItem('travel-visited')
    const savedTrips = localStorage.getItem('travel-trips')
    
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
    if (savedVisited) {
      setVisited(new Set(JSON.parse(savedVisited)))
    }
    if (savedTrips) {
      try { setTrips(JSON.parse(savedTrips)) } catch { setTrips([]) }
    }
  }, [])

  // Save to localStorage when favorites or visited change
  useEffect(() => {
    localStorage.setItem('travel-favorites', JSON.stringify([...favorites]))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('travel-visited', JSON.stringify([...visited]))
  }, [visited])

  useEffect(() => {
    localStorage.setItem('travel-trips', JSON.stringify(trips))
  }, [trips])

  // Load data_structure.json at runtime
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('./data_structure.json')
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error('Falha ao carregar dados', e)
      }
    }
    loadData()
  }, [])

  const toggleFavorite = (activityName) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(activityName)) {
      newFavorites.delete(activityName)
    } else {
      newFavorites.add(activityName)
    }
    setFavorites(newFavorites)
  }

  const toggleVisited = (activityName) => {
    const newVisited = new Set(visited)
    if (newVisited.has(activityName)) {
      newVisited.delete(activityName)
    } else {
      newVisited.add(activityName)
    }
    setVisited(newVisited)
  }

  const goBack = () => {
    if (currentView === 'activity-detail') {
      setCurrentView('activities')
      setSelectedActivity(null)
    } else if (currentView === 'activities') {
      setCurrentView('cities')
      setSelectedCity(null)
    } else if (currentView === 'cities') {
      setCurrentView('countries')
      setSelectedCountry(null)
    } else if (currentView === 'trip-detail') {
      setCurrentView('trips')
    } else if (currentView === 'trip-create') {
      setCurrentView('trips')
    } else if (currentView === 'trips') {
      setCurrentView('countries')
    } else if (currentView === 'trip-day-detail') {
      setCurrentView('trip-detail')
    }
  }

  // Trips helpers
  const parseBRDate = (str) => {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str || '')
    if (!m) return null
    const [_, dd, mm, yyyy] = m
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd))
    return isNaN(d.getTime()) ? null : d
  }
  const formatBRDate = (d) => {
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }
  const daysBetweenInclusive = (start, end) => {
    const days = []
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())
    while (cur.getTime() <= last.getTime()) {
      days.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }
    return days
  }
  const createTrip = (name, startStr, endStr) => {
    const start = parseBRDate(startStr)
    const end = parseBRDate(endStr)
    if (!start || !end || start > end) {
      alert('Datas inválidas. Use dd/mm/aaaa e garanta início <= fim.')
      return
    }
    const id = `trip_${Date.now()}`
    const days = daysBetweenInclusive(start, end).map(d => ({ date: formatBRDate(d), activities: [] }))
    const newTrip = { id, name: name || `Viagem ${formatBRDate(start)}`, start: formatBRDate(start), end: formatBRDate(end), completed: false, days }
    setTrips(prev => [...prev, newTrip])
    setSelectedTrip(newTrip)
    setCurrentView('trip-detail')
  }
  const addActivityToTripDay = (tripId, dateStr, activity) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t
      const days = t.days.map(d => d.date === dateStr ? { ...d, activities: [...d.activities, activity] } : d)
      return { ...t, days }
    }))
    if (selectedTrip && selectedTrip.id === tripId) {
      const days = selectedTrip.days.map(d => d.date === dateStr ? { ...d, activities: [...d.activities, activity] } : d)
      setSelectedTrip({ ...selectedTrip, days })
    }
  }

  const removeActivityFromTripDay = (tripId, dateStr, activityIndex) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t
      const days = t.days.map(d => {
        if (d.date !== dateStr) return d
        const next = d.activities.slice()
        next.splice(activityIndex, 1)
        return { ...d, activities: next }
      })
      return { ...t, days }
    }))
    if (selectedTrip && selectedTrip.id === tripId) {
      const days = selectedTrip.days.map(d => {
        if (d.date !== dateStr) return d
        const next = d.activities.slice()
        next.splice(activityIndex, 1)
        return { ...d, activities: next }
      })
      setSelectedTrip({ ...selectedTrip, days })
    }
  }

  const toggleTripCompleted = (tripId) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, completed: !t.completed } : t))
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip({ ...selectedTrip, completed: !selectedTrip.completed })
    }
  }

  const deleteTrip = (tripId) => {
    const confirmed = confirm('Excluir esta viagem? Esta ação não pode ser desfeita.')
    if (!confirmed) return
    setTrips(prev => prev.filter(t => t.id !== tripId))
    if (selectedTrip && selectedTrip.id === tripId) {
      setSelectedTrip(null)
      setCurrentView('trips')
    }
  }

  const moveActivityInTripDay = (tripId, dateStr, fromIndex, direction) => {
    const delta = direction === 'up' ? -1 : 1
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t
      const days = t.days.map(d => {
        if (d.date !== dateStr) return d
        const toIndex = fromIndex + delta
        if (toIndex < 0 || toIndex >= d.activities.length) return d
        const next = d.activities.slice()
        const [item] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, item)
        return { ...d, activities: next }
      })
      return { ...t, days }
    }))
    if (selectedTrip && selectedTrip.id === tripId) {
      const days = selectedTrip.days.map(d => {
        if (d.date !== dateStr) return d
        const toIndex = fromIndex + delta
        if (toIndex < 0 || toIndex >= d.activities.length) return d
        const next = d.activities.slice()
        const [item] = next.splice(fromIndex, 1)
        next.splice(toIndex, 0, item)
        return { ...d, activities: next }
      })
      setSelectedTrip({ ...selectedTrip, days })
    }
  }

  const updateCustomActivityName = (tripId, dateStr, index, newName) => {
    setTrips(prev => prev.map(t => {
      if (t.id !== tripId) return t
      const days = t.days.map(d => {
        if (d.date !== dateStr) return d
        const next = d.activities.slice()
        if (!next[index]) return d
        next[index] = { ...next[index], name: newName }
        return { ...d, activities: next }
      })
      return { ...t, days }
    }))
    if (selectedTrip && selectedTrip.id === tripId) {
      const days = selectedTrip.days.map(d => {
        if (d.date !== dateStr) return d
        const next = d.activities.slice()
        if (!next[index]) return d
        next[index] = { ...next[index], name: newName }
        return { ...d, activities: next }
      })
      setSelectedTrip({ ...selectedTrip, days })
    }
  }

  const openMap = (coordinates) => {
    const url = `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`
    window.open(url, '_blank')
  }

  const removeDiacritics = (text) => (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const removeNonAlnum = (text) => (text || '').replace(/[^a-zA-Z0-9]/g, '')
  const toTitleCaseWords = (text) => (text || '').split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  const buildImageCandidates = (cityName, activityName) => {
    if (!cityName || !activityName) return []
    const cityUpper = removeDiacritics(cityName).toUpperCase()
    const cityCompact = cityUpper.replace(/\s+/g, '')
    const cityWithUnderscore = cityUpper.replace(/\s+/g, '_')
    let cityVariants = [cityUpper, cityCompact, cityWithUnderscore]
    // For virtual lists, try all real city names as well
    if (cityUpper === 'FAVORITOS' || cityUpper === 'VISITADOS') {
      const allCities = (data?.countries || []).flatMap(c => c.cities.map(ct => removeDiacritics(ct.name).toUpperCase()))
      const extra = []
      for (const cu of allCities) {
        extra.push(cu, cu.replace(/\s+/g, ''), cu.replace(/\s+/g, '_'))
      }
      cityVariants = cityVariants.concat(extra)
    }
    // City alias heuristics
    if (cityUpper === 'SAN GIMIGNANO') {
      cityVariants.push('SANGEMINIANO', 'SANGIMINIANO', 'SANGIMIGNANO')
    }
    const actOriginal = activityName
    const actNoAccents = removeDiacritics(activityName)
    const actNoSpaces = (s) => s.replace(/\s+/g, '')
    const actAlphaNum = (s) => removeNonAlnum(s)
    const actTitle = toTitleCaseWords(actNoAccents)
    const actLower = actNoAccents.toLowerCase()

    // Keyword heuristics (covers files like SIENA_torre.jpg, SIENA_piazza.jpg)
    const tokens = actLower.split(/[^a-z0-9]+/).filter(Boolean)
    const commonKeywords = ['torre','piazza','duomo','catedral','forum','coliseu','panteao','ponte','galleria','galeria','castelo','teatro','ultimaceia','ULTIMACEIA','batisterio','catacumbas','escadaria','praca','espanha','via','apia','appia','accademia','santacroce','santa','croce']
    const matchedKeywords = tokens.filter(t => commonKeywords.includes(t))

    // City-specific overrides
    const perCity = {
      'SIENA': {
        'piazza del campo': ['piazza'],
        'torre del mangia': ['torre']
      },
      'ROMA': {
        'fórum romano': ['forum'],
        'forum romano': ['forum'],
        'panteão': ['panteao'],
        'panteao': ['panteao'],
        'catacumbas de roma': ['catacumbas'],
        'catacumbas de roma ': ['catacumbas'],
        'escadaria da praça de espanha (scalinata di trinità dei monti)': ['EscadariadaPraçadeEspanha','EscadariadaPracadeEspanha','EscadariadaPracaDeEspanha'],
        'escadaria da praca de espanha (scalinata di trinita dei monti)': ['EscadariadaPraçadeEspanha','EscadariadaPracadeEspanha','EscadariadaPracaDeEspanha'],
        'via ápia antiga': ['ViaApiaAntiga','ViaApia'],
        'via apia antiga': ['ViaApiaAntiga','ViaApia'],
        'via apia': ['ViaApia'],
        'via appia antica': ['ViaApiaAntiga','ViaApia']
      },
      'FLORENCA': {
        'duomo de florença (catedral de santa maria del fiore)': ['duomo'],
        'duomo de florenca (catedral de santa maria del fiore)': ['duomo'],
        'duomo de florença': ['Duomo','duomo'],
        'duomo de florenca': ['Duomo','duomo'],
        'ponte vecchio': ['ponte'],
        'galleria degli uffizi': ['galleria'],
        'galleria dell accademia': ['accademia','Galleria_dell_Accademia','GalleriaDellAcademia'],
        'galleria dellaccademia': ['accademia','Galleria_dell_Accademia','GalleriaDellAcademia'],
        'basílica di santa croce': ['santacroce','SantaCroce','BasilicaDeSantaCroce'],
        'basilica di santa croce': ['santacroce','SantaCroce','BasilicaDeSantaCroce'],
        'piazza san giovanni': ['PiazzaSanGiovanni','piazzasangiovanni'],
        'palazzo pitti': ['PalazzoPitti','palazzopitti'],
        'palazzo vecchio': ['PalazzoVecchio','palazzovecchio'],
        'basílica de san lorenzo': ['BasilicaDeSanLorenzo','basilicadesanlorenzo'],
        'piazzale michelangelo': ['PiazzaleMichelangelo','piazzalemichelangelo']
      },
      'MILAO': {
        'galleria vittorio emanuele ii': ['galeria','galleria'],
        'teatro alla scala': ['teatro'],
        'A Última ceia': ['ultimaceia','UltimaCeia','ULTIMACEIA'],
        'A Ultima ceia': ['ultimaceia','UltimaCeia','ULTIMACEIA'],
        'a última ceia': ['ultimaceia','UltimaCeia','ULTIMACEIA'],
        'a ultima ceia': ['ultimaceia','UltimaCeia','ULTIMACEIA']
      },
      'PISA': {
        'batistério de pisa': ['batisterio'],
        'batisterio de pisa': ['batisterio']
      },
      'SAN GIMIGNANO': {
        'duomo di san gimignano (colegiada de santa maria assunta)': ['duomo','catedral'],
        'piazza della cisterna': ['piazza'],
        'torre grossa': ['torre']
      }
    }
    const overrides = (perCity[cityUpper] || {})[actLower] || []

    const names = [
      ...overrides,
      actOriginal,
      actNoAccents,
      actNoSpaces(actOriginal),
      actNoSpaces(actNoAccents),
      actAlphaNum(actOriginal),
      actAlphaNum(actNoAccents),
      actNoSpaces(actTitle),
      ...matchedKeywords
    ]
    const variants = []
    for (const city of Array.from(new Set(cityVariants))) {
      for (const n of Array.from(new Set(names))) {
        variants.push(`${city}_${n}`)
      }
    }
    const exts = ['jpg', 'png', 'jpeg', 'webp']
    const paths = []
    for (const v of variants) {
      for (const ext of exts) {
        paths.push(`/public/Images/${encodeURIComponent(v)}.${ext}`)
        paths.push(`/Images/${encodeURIComponent(v)}.${ext}`) // Fallback
      }
    }
    return paths
  }

  // Build audio file candidates, including patterns like ROMA_NomeDaAtividade.mp3
  const buildAudioCandidates = (cityName, activityName) => {
    if (!activityName) return []
    const cityUpper = removeDiacritics(cityName || '').toUpperCase()
    const cityCompact = cityUpper.replace(/\s+/g, '')
    const cityWithUnderscore = cityUpper.replace(/\s+/g, '_')
    let cityVariants = [cityUpper, cityCompact, cityWithUnderscore]
    // For virtual lists like Favoritos/Visitados, try all real city names
    if (cityUpper === 'FAVORITOS' || cityUpper === 'VISITADOS') {
      const allCities = (data?.countries || []).flatMap(c => c.cities.map(ct => removeDiacritics(ct.name).toUpperCase()))
      const extra = []
      for (const cu of allCities) {
        extra.push(cu, cu.replace(/\s+/g, ''), cu.replace(/\s+/g, '_'))
      }
      cityVariants = cityVariants.concat(extra)
    }

    const actOriginal = activityName
    const actNoAccents = removeDiacritics(activityName)
    const actNoSpaces = (s) => (s || '').replace(/\s+/g, '')
    const actAlphaNum = (s) => removeNonAlnum(s || '')
    const actTitle = toTitleCaseWords(actNoAccents)
    const actLower = (actNoAccents || '').toLowerCase()

    // Try to capture keyword-based short filenames like ROMA_catacumbas.mp3
    const tokens = actLower.split(/[^a-z0-9]+/).filter(Boolean)
    const commonKeywords = ['catacumbas','escadaria','praca','espanha','via','apia','appia','forum','coliseu','panteao','trevi','navona','santangelo','capitolinos','barberini','vaticano','termas']

    // City-specific overrides similar to image heuristics
    const perCity = {
      'ROMA': {
        'fórum romano': ['forum'],
        'forum romano': ['forum'],
        'panteão': ['panteao'],
        'panteao': ['panteao'],
        'catacumbas de roma': ['catacumbas'],
        'catacumbas de roma ': ['catacumbas'],
        'escadaria da praça de espanha (scalinata di trinità dei monti)': ['EscadariadaPraçadeEspanha','EscadariadaPracadeEspanha','EscadariadaPracaDeEspanha'],
        'escadaria da praca de espanha (scalinata di trinita dei monti)': ['EscadariadaPraçadeEspanha','EscadariadaPracadeEspanha','EscadariadaPracaDeEspanha'],
        'via ápia antiga': ['ViaApiaAntiga','ViaApia'],
        'via apia antiga': ['ViaApiaAntiga','ViaApia'],
        'via apia': ['ViaApia'],
        'via appia antica': ['ViaApiaAntiga','ViaApia']
      }
    }
    const overrides = (perCity[cityUpper] || {})[actLower] || []
    const matchedKeywords = tokens.filter(t => commonKeywords.includes(t))

    const names = [
      actOriginal,
      actNoAccents,
      actNoSpaces(actOriginal),
      actNoSpaces(actNoAccents),
      actAlphaNum(actOriginal),
      actAlphaNum(actNoAccents),
      actNoSpaces(actTitle),
      ...matchedKeywords,
      ...overrides
    ]

    const candidates = []
    // Activity-specific with city prefix
    for (const city of Array.from(new Set(cityVariants))) {
      for (const n of Array.from(new Set(names))) {
        const base = `${city}_${n}`
        candidates.push(`/public/Audio/${encodeURIComponent(base)}.mp3`)
        candidates.push(`/Audio/${encodeURIComponent(base)}.mp3`) // Fallback
      }
    }
    // Generic activity name (already supported below but keep ordering predictable)
    candidates.push(`/public/Audio/${encodeURIComponent(actOriginal)}.mp3`)
    candidates.push(`/Audio/${encodeURIComponent(actOriginal)}.mp3`) // Fallback
    candidates.push(`/public/Audio/${encodeURIComponent((actOriginal || '').toUpperCase())}.mp3`)
    candidates.push(`/Audio/${encodeURIComponent((actOriginal || '').toUpperCase())}.mp3`) // Fallback
    // City-generic audio as last resort (e.g., Roma.mp3)
    if (cityName) {
      candidates.push(`/public/Audio/${encodeURIComponent(cityName)}.mp3`)
      candidates.push(`/Audio/${encodeURIComponent(cityName)}.mp3`) // Fallback
      candidates.push(`/public/Audio/${encodeURIComponent(cityUpper)}.mp3`)
      candidates.push(`/Audio/${encodeURIComponent(cityUpper)}.mp3`) // Fallback
    }
    return candidates
  }

  const getPrimaryImagePath = (cityName, activityName) => {
    const candidates = buildImageCandidates(cityName, activityName)
    return candidates[0] || null
  }

  // City thumbnail helpers
  const buildCityThumbCandidates = (cityName) => {
    if (!cityName) return []
    const nameUpper = removeDiacritics(cityName).toUpperCase()
    const variants = [
      nameUpper,
      nameUpper.replace(/\s+/g, ''),
      nameUpper.replace(/\s+/g, '_')
    ]
    if (nameUpper === 'SAN GIMIGNANO') {
      variants.push('SANGEMINIANO')
    }
    const exts = ['jpg', 'png', 'jpeg', 'webp']
    const paths = []
    for (const v of Array.from(new Set(variants))) {
      for (const ext of exts) {
        paths.push(`/public/Images/${encodeURIComponent(v)}.${ext}`)
        paths.push(`/Images/${encodeURIComponent(v)}.${ext}`) // Fallback
      }
    }
    return paths
  }
  const getCityThumbPrimary = (cityName) => {
    const c = buildCityThumbCandidates(cityName)
    return c[0] || null
  }

  // Resolve audio URL from data or fallbacks in /Audio
  useEffect(() => {
    const resolveAudio = async () => {
      if (!selectedActivity) {
        setResolvedAudioUrl('')
        return
      }
      const name = selectedActivity.name || ''
      const candidates = [
        selectedActivity.narration_audio,
        ...buildAudioCandidates(selectedCity?.name || '', name)
      ].filter(Boolean)

      console.log('Tentando resolver áudio para:', name, 'Candidatos:', candidates)

      for (const url of candidates) {
        try {
          console.log('Testando URL:', url)
          const res = await fetch(url, { method: 'HEAD' })
          if (res.ok) {
            console.log('Áudio encontrado:', url)
            setResolvedAudioUrl(url)
            return
          } else {
            console.log('Áudio não encontrado:', url, 'Status:', res.status)
          }
        } catch (error) {
          console.log('Erro ao testar áudio:', url, error)
        }
      }
      console.log('Nenhum áudio encontrado para:', name)
      setResolvedAudioUrl('')
    }
    resolveAudio()
  }, [selectedActivity])

  const downloadFile = async (fileUrl, filename) => {
    try {
      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error('Falha ao baixar o arquivo')
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = filename || 'narracao.mp3'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error(error)
      alert('Não foi possível baixar o áudio agora.')
    }
  }

  const openActivityDetailFromTrip = (activityName, cityName, dateStr) => {
    if (!data) return
    const country = (data.countries || []).find(c => c.cities.some(ct => ct.name.toLowerCase() === (cityName || '').toLowerCase()))
    const city = country ? country.cities.find(ct => ct.name.toLowerCase() === (cityName || '').toLowerCase()) : null
    const activity = city ? city.activities.find(a => a.name.toLowerCase() === (activityName || '').toLowerCase()) : null
    if (!city || !activity) {
      alert('Atividade não encontrada nos dados.')
      return
    }
    if (selectedTrip) {
      setLastTripContext({ tripId: selectedTrip.id, date: dateStr || selectedTripDayDate || null })
    }
    setSelectedCountry(country)
    setSelectedCity(city)
    setSelectedActivity(activity)
    setCurrentView('activity-detail')
  }

  const renderCountries = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Guia de Viagem de Bolso</h1>
          <p className="text-gray-600">Vamos viajar juntos</p>
        </div>
        <div className="flex justify-center gap-3 mb-6">
          <Button variant="outline" size="sm" onClick={() => {
            // Ir para lista de favoritos: filtra todas as atividades favoritas
            const allActivities = (data?.countries || []).flatMap(c => c.cities.flatMap(ct => ct.activities))
            const favs = allActivities.filter(a => favorites.has(a.name))
            if (favs.length) {
              setSelectedCountry(null)
              setSelectedCity({ name: 'Favoritos', activities: favs })
              setCurrentView('activities')
            } else {
              alert('Você ainda não tem favoritos. Marque alguns!')
            }
          }}>Favoritos</Button>
          <Button variant="outline" size="sm" onClick={() => {
            const allActivities = (data?.countries || []).flatMap(c => c.cities.flatMap(ct => ct.activities))
            const vis = allActivities.filter(a => visited.has(a.name))
            if (vis.length) {
              setSelectedCountry(null)
              setSelectedCity({ name: 'Visitados', activities: vis })
              setCurrentView('activities')
            } else {
              alert('Você ainda não marcou visitas. Marque algumas!')
            }
          }}>Visitados</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentView('trips')}>Viagens</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.countries || []).map((country) => (
            <Card 
              key={country.name} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
              onClick={() => {
                setSelectedCountry(country)
                setCurrentView('cities')
              }}
            >
              {removeDiacritics(country.name).toUpperCase() === 'ITALIA' && (
                <img
                  src="/public/Images/ITALIA.png"
                  alt="Mapa da Itália"
                  className="absolute top-2 right-2 w-16 h-16 object-contain opacity-80 pointer-events-none select-none"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {country.name}
                </CardTitle>
                <CardDescription>
                  {country.cities.length} cidades para explorar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {country.cities.slice(0, 3).map((city) => (
                    <Badge key={city.name} variant="secondary">
                      {city.name}
                    </Badge>
                  ))}
                  {country.cities.length > 3 && (
                    <Badge variant="outline">+{country.cities.length - 3} mais</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCities = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{selectedCountry?.name}</h1>
              <p className="text-gray-600">Escolha uma cidade para explorar</p>
            </div>
            {removeDiacritics(selectedCountry?.name || '').toUpperCase() === 'ITALIA' && (
              <img
                src="/Images/ITALIA.png"
                alt="Mapa da Itália"
                className="h-10 w-auto object-contain opacity-80 pointer-events-none select-none"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedCountry?.cities || []).map((city) => (
            <Card 
              key={city.name} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => {
                setSelectedCity(city)
                setCurrentView('activities')
              }}
            >
              <div className="h-28 bg-gray-200">
                <img
                  src={getCityThumbPrimary(city.name)}
                  alt={city.name}
                  className="w-full h-full object-cover"
                  data-alt={buildCityThumbCandidates(city.name).slice(1).join('|')}
                  onError={(e) => {
                    const rest = (e.target.dataset.alt || '').split('|').filter(Boolean)
                    if (rest.length) {
                      const next = rest.shift()
                      e.target.dataset.alt = rest.join('|')
                      e.target.src = next
                    } else {
                      e.target.style.display = 'none'
                    }
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  {city.name}
                </CardTitle>
                <CardDescription>
                  {city.activities.length} atividades disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {city.activities.slice(0, 2).map((activity) => (
                    <Badge key={activity.name} variant="secondary">
                      {activity.name}
                    </Badge>
                  ))}
                  {city.activities.length > 2 && (
                    <Badge variant="outline">+{city.activities.length - 2} mais</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderActivities = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{selectedCity?.name}</h1>
            <p className="text-gray-600">Atividades e pontos turísticos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedCity?.activities || []).map((activity) => (
            <Card 
              key={activity.name} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
              onClick={() => {
                setSelectedActivity(activity)
                setCurrentView('activity-detail')
              }}
            >
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={getPrimaryImagePath(selectedCity?.name, activity.name)} 
                  alt={activity.name}
                  className="w-full h-full object-cover"
                  data-alt={buildImageCandidates(selectedCity?.name, activity.name).slice(1).join('|')}
                  onError={(e) => {
                    const rest = (e.target.dataset.alt || '').split('|').filter(Boolean)
                    if (rest.length) {
                      const next = rest.shift()
                      e.target.dataset.alt = rest.join('|')
                      e.target.src = next
                    } else {
                      e.target.style.display = 'none'
                    }
                  }}
                />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {favorites.has(activity.name) && (
                      <div className="bg-red-500 text-white p-1 rounded-full">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                    )}
                    {visited.has(activity.name) && (
                      <div className="bg-green-500 text-white p-1 rounded-full">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{activity.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {activity.suggested_time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  const renderTrips = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Minhas Viagens</h2>
          <Button variant="outline" onClick={() => setCurrentView('trip-create')}>Nova viagem</Button>
        </div>
        <div className="space-y-3">
          {trips.length === 0 && (
            <p className="text-gray-600">Nenhuma viagem criada ainda.</p>
          )}
          {trips.map((t) => (
            <Card key={t.id} className="hover:shadow">
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="cursor-pointer" onClick={() => { setSelectedTrip(t); setCurrentView('trip-detail') }}>
                  <CardTitle className="text-lg">{t.name} {t.completed && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 align-middle">Concluída</span>}</CardTitle>
                  <CardDescription>{t.start} — {t.end}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleTripCompleted(t.id)}>{t.completed ? 'Reabrir' : 'Concluir'}</Button>
                  <Button size="sm" variant="outline" onClick={() => deleteTrip(t.id)}>Excluir</Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-6">
          <Button variant="outline" onClick={goBack}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
        </div>
      </div>
    </div>
  )

  const renderTripCreate = () => {
    let nameInput, startInput, endInput
    const submit = () => createTrip(nameInput.value, startInput.value, endInput.value)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={goBack}><ArrowLeft className="w-4 h-4 mr-2" />Voltar</Button>
            <h2 className="text-2xl font-bold text-gray-800">Nova Viagem</h2>
          </div>
          <Card>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nome da viagem (opcional)</label>
                <input ref={el => nameInput = el} className="w-full border rounded px-3 py-2" placeholder="Itália 2025" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Início (dd/mm/aaaa)</label>
                  <input ref={el => startInput = el} className="w-full border rounded px-3 py-2" placeholder="30/11/2025" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fim (dd/mm/aaaa)</label>
                  <input ref={el => endInput = el} className="w-full border rounded px-3 py-2" placeholder="07/12/2025" />
                </div>
              </div>
              <Button onClick={submit}>Criar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderTripDetail = () => {
    if (!selectedTrip) return null
    const allActivities = (data?.countries || []).flatMap(c => 
      c.cities.flatMap(ct => ct.activities.map(a => ({...a, _city: ct.name, _country: c.name})))
    )
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={goBack}><span className="w-4 h-4 mr-2" aria-hidden="true">←</span>Voltar</Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedTrip.name} {selectedTrip.completed && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 align-middle">Concluída</span>}</h2>
                <p className="text-gray-600">{selectedTrip.start} — {selectedTrip.end}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleTripCompleted(selectedTrip.id)}>{selectedTrip.completed ? 'Reabrir' : 'Concluir viagem'}</Button>
              <Button variant="outline" size="sm" onClick={() => deleteTrip(selectedTrip.id)}>Excluir viagem</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedTrip.days.map(d => (
              <Card key={d.date} className="cursor-pointer hover:shadow" onClick={() => { setSelectedTripDayDate(d.date); setCurrentView('trip-day-detail') }}>
                <CardHeader>
                  <CardTitle className="text-lg">{d.date}</CardTitle>
                  <CardDescription>
                    {d.activities.length === 0 ? 'Sem atividades' : `${d.activities.length} atividade(s)`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {d.activities.slice(0, 4).map((a, idx) => (
                    <div key={`${a.name}-${idx}`} className="text-sm flex items-center justify-between gap-2">
                      <span className="truncate">• {a.name}{a._city ? ` — ${a._city}` : ''}</span>
                      {a._city && (
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openActivityDetailFromTrip(a.name, a._city, d.date) }}>Abrir</Button>
                      )}
                    </div>
                  ))}
                  {d.activities.length > 4 && (
                    <div className="text-xs text-gray-500">+{d.activities.length - 4} mais</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderTripDayDetail = () => {
    if (!selectedTrip || !selectedTripDayDate) return null
    const day = (selectedTrip.days || []).find(d => d.date === selectedTripDayDate)
    const allActivities = (data?.countries || []).flatMap(c => 
      c.cities.flatMap(ct => ct.activities.map(a => ({...a, _city: ct.name, _country: c.name})))
    )
    const filtered = allActivities.filter(a => a.name.toLowerCase().includes(tripActivitySearch.toLowerCase()))
    const byNameKey = (a) => `${a.name}__${a._city}`
    const uniq = []
    const seen = new Set()
    for (const a of filtered) {
      const k = byNameKey(a)
      if (!seen.has(k)) { seen.add(k); uniq.push(a) }
    }
    let selectEl = null
    const addSelected = () => {
      const idx = Number(selectEl?.value)
      if (Number.isNaN(idx)) return
      const act = uniq[idx]
      if (!act) return
      addActivityToTripDay(selectedTrip.id, selectedTripDayDate, { name: act.name, description: act.description, image: act.image, _city: act._city })
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={goBack}><span className="w-4 h-4 mr-2" aria-hidden="true">←</span>Voltar</Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedTrip.name}</h2>
                <p className="text-gray-600">Dia {selectedTripDayDate}</p>
              </div>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividades do dia</CardTitle>
              <CardDescription>Adicionar, excluir e reordenar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Buscar atividade..."
                  value={tripActivitySearch}
                  onChange={e => setTripActivitySearch(e.target.value)}
                />
                <select ref={el => (selectEl = el)} className="md:w-1/2 border rounded px-2 py-2 text-sm">
                  {uniq.map((a, i) => (
                    <option key={byNameKey(a)} value={i}>{a.name} — {a._city}</option>
                  ))}
                </select>
                <Button variant="outline" onClick={addSelected}>Adicionar</Button>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <input
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Adicionar atividade livre (ex: Translado trem, Almoço...)"
                  ref={el => (selectEl && (selectEl._customInput = el))}
                />
                <Button variant="outline" onClick={() => {
                  const val = selectEl?._customInput?.value?.trim()
                  if (!val) return
                  addActivityToTripDay(selectedTrip.id, selectedTripDayDate, { name: val, isCustom: true })
                  selectEl._customInput.value = ''
                }}>Adicionar livre</Button>
              </div>
              <div className="divide-y">
                {day?.activities?.length ? day.activities.map((a, idx) => (
                  <div key={`${a.name}-${idx}`} className="py-2 flex items-center justify-between gap-2">
                    <span className="text-sm">
                      • {customEdit && customEdit.date === selectedTripDayDate && customEdit.index === idx ? (
                        <input
                          className="border rounded px-2 py-1 text-sm"
                          value={customEdit.value}
                          onChange={e => setCustomEdit({ ...customEdit, value: e.target.value })}
                        />
                      ) : (
                        <>
                          {a.name}{a._city ? ` — ${a._city}` : ''}
                        </>
                      )}
                    </span>
                    <div className="flex items-center gap-1">
                      {a._city && !a.isCustom && (
                        <Button variant="outline" size="sm" onClick={() => openActivityDetailFromTrip(a.name, a._city)}>Abrir</Button>
                      )}
                      {a.isCustom && (
                        customEdit && customEdit.date === selectedTripDayDate && customEdit.index === idx ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => { updateCustomActivityName(selectedTrip.id, selectedTripDayDate, idx, (customEdit.value || '').trim()); setCustomEdit(null) }}>Salvar</Button>
                            <Button variant="outline" size="sm" onClick={() => setCustomEdit(null)}>Cancelar</Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => setCustomEdit({ date: selectedTripDayDate, index: idx, value: a.name })}>Editar</Button>
                        )
                      )}
                      <Button variant="outline" size="sm" onClick={() => moveActivityInTripDay(selectedTrip.id, selectedTripDayDate, idx, 'up')}>↑</Button>
                      <Button variant="outline" size="sm" onClick={() => moveActivityInTripDay(selectedTrip.id, selectedTripDayDate, idx, 'down')}>↓</Button>
                      <Button variant="outline" size="sm" onClick={() => removeActivityFromTripDay(selectedTrip.id, selectedTripDayDate, idx)}>Remover</Button>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-600">Sem atividades</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  const renderActivityDetail = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          {lastTripContext && (
            <Button variant="outline" onClick={() => {
              const t = trips.find(tr => tr.id === lastTripContext.tripId)
              if (!t) { setCurrentView('trips'); return }
              setSelectedTrip(t)
              if (lastTripContext.date) {
                setSelectedTripDayDate(lastTripContext.date)
                setCurrentView('trip-day-detail')
              } else {
                setCurrentView('trip-detail')
              }
            }}>
              Voltar para o dia
            </Button>
          )}
        </div>
        
        <Card className="overflow-hidden">
          <div className="h-64 md:h-96 bg-gray-200 relative">
            <img 
              src={getPrimaryImagePath(selectedCity?.name, selectedActivity?.name)} 
              alt={selectedActivity?.name || ''}
              className="w-full h-full object-cover"
              data-alt={buildImageCandidates(selectedCity?.name, selectedActivity?.name).slice(1).join('|')}
              onError={(e) => {
                const rest = (e.target.dataset.alt || '').split('|').filter(Boolean)
                if (rest.length) {
                  const next = rest.shift()
                  e.target.dataset.alt = rest.join('|')
                  e.target.src = next
                } else {
                  e.target.style.display = 'none'
                }
              }}
            />
          </div>
          
          <CardHeader className="relative">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{selectedActivity?.name}</CardTitle>
                <CardDescription className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedActivity?.suggested_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedCity?.name}
                  </span>
                </CardDescription>
              </div>
              <div className="absolute top-2 right-2 z-10 flex md:flex-row flex-col gap-2">
                <Button
                  variant={favorites.has(selectedActivity?.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFavorite(selectedActivity?.name)}
                  className="w-10 h-10 md:w-auto md:h-9 p-0 md:px-2 flex items-center justify-center"
                >
                  <Heart className={`w-5 h-5 md:mr-2 ${favorites.has(selectedActivity?.name) ? 'fill-current' : ''}`} />
                  <span className="hidden md:inline">
                    {favorites.has(selectedActivity?.name) ? 'Favorito' : 'Favoritar'}
                  </span>
                </Button>
                <Button
                  variant={visited.has(selectedActivity?.name) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleVisited(selectedActivity?.name)}
                  className="w-10 h-10 md:w-auto md:h-9 p-0 md:px-2 flex items-center justify-center"
                >
                  <Check className="w-5 h-5 md:mr-2" />
                  <span className="hidden md:inline">
                    {visited.has(selectedActivity?.name) ? 'Visitado' : 'Marcar como visitado'}
                  </span>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedActivity?.description}
              </p>
            </div>
            
            {selectedActivity?.map_coordinates && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Localização</h3>
                <Button 
                  variant="outline" 
                  onClick={() => openMap(selectedActivity.map_coordinates)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <img
                    src="/public/Images/googlemaps.png"
                    alt="Google Maps"
                    className="w-5 h-5 object-contain"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  Clique para ver no Google Maps
                </Button>
              </div>
            )}
            
            {resolvedAudioUrl && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Narração</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Áudio guia disponível para ouvir e baixar offline
                </p>
                <div className="space-y-3">
                  <OptimizedAudio
                    src={resolvedAudioUrl}
                    className="w-full"
                  />
                  <Button
                    variant="outline"
                    onClick={() => downloadFile(
                      resolvedAudioUrl,
                      `${selectedActivity.name.replace(/\s+/g, '_').toLowerCase()}_narracao.mp3`
                    )}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar áudio para ouvir offline
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="font-sans">
      {currentView === 'countries' && renderCountries()}
      {currentView === 'cities' && renderCities()}
      {currentView === 'activities' && renderActivities()}
      {currentView === 'activity-detail' && renderActivityDetail()}
      {currentView === 'trips' && renderTrips()}
      {currentView === 'trip-create' && renderTripCreate()}
      {currentView === 'trip-detail' && renderTripDetail()}
      {currentView === 'trip-day-detail' && renderTripDayDetail()}
    </div>
  )
}

window.App = App

// Self-mount when running in the browser without a bundler
;(function mountAppIfPossible() {
  const container = document.getElementById('root')
  if (!container) return
  try {
    const root = ReactDOM.createRoot(container)
    root.render(React.createElement(App))
  } catch (e) {
    // ReactDOM might not be loaded yet; try again shortly
    setTimeout(mountAppIfPossible, 50)
  }
})()

