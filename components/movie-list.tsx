'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string
}

export function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchMovies = async (query: string = '') => {
    setLoading(true)
    setError(null)
    try {
      const endpoint = query
        ? `https://api.themoviedb.org/3/search/movie?api_key=59cddbb62ceaa5026246385b46dd867a&language=en-US&query=${encodeURIComponent(query)}&page=1`
        : 'https://api.themoviedb.org/3/movie/popular?api_key=59cddbb62ceaa5026246385b46dd867a&language=en-US&page=1'
      
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }
      const data = await response.json()
      setMovies(data.results)
    } catch (err) {
      setError('An error occurred while fetching movies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMovies(searchQuery)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Movie Search</h1>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
      
      {loading && <div className="text-center p-4">Loading...</div>}
      
      {error && <div className="text-center p-4 text-red-500">{error}</div>}
      
      {!loading && !error && (
        <ScrollArea className="h-[600px] w-full rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {movies.map((movie) => (
              <Card key={movie.id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{movie.title}</CardTitle>
                  <CardDescription>{new Date(movie.release_date).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      className="w-full h-48 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md mb-2">
                      No image available
                    </div>
                  )}
                  <p className="text-sm line-clamp-3">{movie.overview}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {!loading && !error && movies.length === 0 && (
        <div className="text-center p-4">No movies found. Try a different search term.</div>
      )}
    </div>
  )
}