import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Account() {
  const [email, setEmail] = useState('');

  async function getUser() {    
    const { data, error } = await supabase.auth.getUserIdentities()
    if (data) {
      setEmail(data.identities[0].email);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  const handleSignOut = () => {
    supabase.auth.signOut();
    localStorage.clear();
    location.reload();
  }

  return (
    <form className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={email} disabled />
      </div>

      <div>
        <button className="adminBtn" type="button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </form>
  )
}