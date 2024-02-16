import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d2N1dmJnZHN3b2F0am51cGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwNDExOTYsImV4cCI6MjAyMzYxNzE5Nn0.dt8qknmzhpUN38Cp3WIJpJo17AxEcjIQCKOYWTciKjM";
const supabase = createClient("https://mtwcuvbgdswoatjnupgb.supabase.co", key);

function Equipe() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    const { data } = await supabase.from("categories").select();
    setCategories(data);
  }

  return (
    <ul>
      {categories.map((categorie) => (
        <li key={categorie.title}>{categorie.title}</li>
      ))}
    </ul>
  );
}

export default Equipe;