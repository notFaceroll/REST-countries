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

interface CountryInfo {
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
}

export function Main() {
  const [countriesList, setCountriesList] = useState<CountryInfo[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [regionCountries, setRegionCountries] = useState<CountryInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (selectedRegion === "all" || selectedRegion === "") {
      setRegionCountries(countriesList);
    } else {
      const filtered = countriesList.filter(
        (country: CountryInfo) =>
          country.region.toLowerCase() === selectedRegion
      );
      setRegionCountries(filtered);
    }
  }, [selectedRegion]);

  const filteredCountries =
    searchTerm.length > 0
      ? regionCountries.filter((country: CountryInfo) =>
          country.name.common.includes(searchTerm)
        )
      : regionCountries;

  async function fetchCountries() {
    try {
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,currencies,population,region,flags"
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

  function formatPopulationNumber(population: number) {
    return new Intl.NumberFormat("de-DE").format(population);
  }

  function handleRegionChange(region: string) {
    setSelectedRegion(region);
  }

  console.log({ filteredCountries });
  console.log({ regionCountries });

  return (
    <div className="flex flex-col min-h-screen bg-very-dark-blue-dark-mode-background">
      <header className="flex items-center h-16 px-2 bg-dark-blue-dark-mode-elements ">
        <div className="max-w-[1440px] w-full m-auto text-black ">
          <span className="text-white">Where in the world?</span>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] w-full m-auto">
        <div className="flex justify-between backdrop-blur-md items-center py-10 sticky top-0 bg-very-dark-blue-dark-mode-background">
          <Input
            type="text"
            placeholder="Search for a country"
            className="max-w-sm"
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <Select onValueChange={handleRegionChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="americas">Americas</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="oceania">Oceania</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 gap-8">
          {filteredCountries?.map((country: CountryInfo) => (
            <Card key={country.name.common} className="overflow-hidden">
              <img
                className="max-w-full block object-cover h-2/5 w-full"
                src={country?.flags?.png}
                alt={country.name.common}
              />
              <CardHeader>
                <CardTitle>{country?.name?.common}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
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
    </div>
  );
}
