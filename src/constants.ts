import type { ProviderData } from "./App";

export const PROVIDER_INPUT_REGEXS: Record<keyof ProviderData, RegExp> = {
  first_name: /^[a-zA-Z\s'-]{2,}$/,
  last_name: /^[a-zA-Z\s'-]{2,}$/,
  email_address: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  specialty: /^[a-zA-Z\s'-]{2,}$/,
  practice_name: /^.{2,}$/,
};

export const PROVIDER_INPUT_ERROR_MESSAGES = {
  first_name: "Enter a valid first name (required, min 2 letters)",
  last_name: "Enter a valid last name (required, min 2 letters)",
  email_address: "Enter a valid email address (required)",
  specialty:
    "Enter a valid specialty (letters, spaces, apostrophes, hyphens, min 2 chars)",
  practice_name: "Enter a valid practice name (min 2 chars)",
};

export const PROVIDER_FIELD_TITLES = {
  first_name: "First Name",
  last_name: "Last Name",
  email_address: "Email Address",
  specialty: "Specialty",
  practice_name: "Practice Name",
};

export const UNIQUE_SAMPLE_PROVIDERS: ProviderData[] = [
  {
    last_name: "Anderson",
    first_name: "Olivia",
    email_address: "olivia.anderson@healthplus.com",
    specialty: "Dermatology",
    practice_name: "Anderson Skin Clinic",
  },
  {
    last_name: "Bennett",
    first_name: "Liam",
    email_address: "liam.bennett@footcare.org",
    specialty: "Podiatry",
    practice_name: "Bennett Foot Center",
  },
  {
    last_name: "Chavez",
    first_name: "Sophia",
    email_address: "sophia.chavez@smilesdental.com",
    specialty: "Dentistry",
    practice_name: "Chavez Family Dental",
  },
  {
    last_name: "Dawson",
    first_name: "Noah",
    email_address: "noah.dawson@visionfirst.com",
    specialty: "Ophthalmology",
    practice_name: "Dawson Eye Care",
  },
  {
    last_name: "Evans",
    first_name: "Mia",
    email_address: "mia.evans@wellnesspt.com",
    specialty: "Physical Therapy",
    practice_name: "Evans Wellness PT",
  },
];
