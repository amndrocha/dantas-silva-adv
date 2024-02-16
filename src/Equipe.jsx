import { useEffect, useState } from "react";
import { supabase } from './supabaseClient'

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