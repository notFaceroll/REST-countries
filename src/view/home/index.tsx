import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Flag {
  png: string;
  svg: string;
  alt: string;
}

interface NativeName {
  official: string;
  common: string;
}

interface Currencies {
  [currencyCode: string]: {
    name: string;
    symbol: string;
  };
}

export interface CountryInfo {
  flags: Flag;
  name: {
    common: string;
    official: string;
    nativeName: {
      [language: string]: NativeName;
    };
  };
  currencies: Currencies;
  capital: string[];
  region: string;
  population: number;
  cca3: string;
  subregion: string;
  tld: string[];
  languages: {
    [languageCode: string]: string;
  };
  borders: string[];
}

export function Home() {
  const [countriesList, setCountriesList] = useState<CountryInfo[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [regionCountries, setRegionCountries] = useState<CountryInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  async function fetchCountries() {
    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,currencies,population,region,flags,cca3,subregion,tld,currencies,languages,borders"
      );
      const data: CountryInfo[] = await response.json();

      setCountriesList(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedRegion === "all") {
      setRegionCountries(countriesList);
    } else {
      const filtered = countriesList.filter(
        (country: CountryInfo) =>
          country.region.toLowerCase() === selectedRegion
      );
      setRegionCountries(filtered);
    }
  }, [selectedRegion, countriesList]);

  const filteredCountries =
    searchTerm.length > 0
      ? regionCountries.filter((country: CountryInfo) =>
          country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : regionCountries;

  function formatPopulationNumber(population: number) {
    return new Intl.NumberFormat("de-DE").format(population);
  }

  function handleRegionChange(region: string) {
    setSelectedRegion(region);
  }

  function handleNavigation(country: CountryInfo) {
    navigate(`/${country.cca3}`, { state: { country } });
  }

  if (!countriesList.length) {
    return (
      <div className="p-6">
        <div className="flex flex-col space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-[40px] w-full rounded-xl" />
            <Skeleton className="h-[40px] w-full rounded-xl" />
          </div>
          <Skeleton className="w-full h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-[1440px] w-full m-auto px-4 xl:px-0">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 justify-between px-2 items-center py-10 sticky top-0 bg-very-light-gray-light-mode-background dark:bg-very-dark-blue-dark-mode-background">
        <Input
          type="text"
          placeholder="Search for a country"
          className="max-w-sm dark:bg-dark-blue-dark-mode-elements bg-white dark:text-white text-very-dark-blue-light-mode-text"
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <Select onValueChange={handleRegionChange}>
          <SelectTrigger className="sm:w-[180px] dark:bg-dark-blue-dark-mode-elements bg-white dark:text-white text-very-dark-blue-light-mode-text">
            <SelectValue placeholder="Filter by Region" />
          </SelectTrigger>
          <SelectContent className="dark:bg-dark-blue-dark-mode-elements bg-white dark:text-white text-very-dark-blue-light-mode-text">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="americas">Americas</SelectItem>
            <SelectItem value="africa">Africa</SelectItem>
            <SelectItem value="oceania">Oceania</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
        {filteredCountries?.map((country: CountryInfo) => (
          <Card
            onClick={() => {
              handleNavigation(country);
            }}
            key={country.name.common}
            className="overflow-hidden min-h-[320px] dark:bg-dark-blue-dark-mode-elements bg-white border-0 shadow-md cursor-pointer"
          >
            <img
              className="max-w-full block object-cover h-2/5 w-full"
              src={country.flags.png}
              alt={country.name.common}
            />

            <CardHeader>
              <CardTitle>{country.name.common}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col justify-center">
              <span>
                <strong>Population:</strong>{" "}
                {formatPopulationNumber(country.population)}
              </span>

              <span>
                <strong>Region:</strong> {country.region}
              </span>

              <span>
                <strong>Capital:</strong> {country.capital}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
