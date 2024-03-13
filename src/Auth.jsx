import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(true);

    if (error) {
      alert(error.error_description || error.message)
    }

    setLoading(false);
    location.reload();
  }

  return (
          <form onSubmit={handleLogin}
          style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px'}}>
            <label htmlFor=''>Login administrativo:</label> 
            <input
              className="inputField"
              type="text"
              placeholder="E-mail"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type='password'
            placeholder="Senha"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button className='adminBtn' disabled={loading}>
              {loading ? 'Carregando...' : 'Enviar'}
            </button> 
          </form>
  )
}