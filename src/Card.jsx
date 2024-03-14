import { useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import './Card.css';

function Card() {
    let { id } = useParams();
    const [member, setMember] = useState({}); 
  
    async function getMember() {
        const { data } = await supabase.from("equipe").select();
        let foundMember = data.find(member => member.id == id);
        if (foundMember) {
            setMember(foundMember);
        }
    }

    useEffect(() => {
        getMember();
      }, []);

    return (
    <div>
        <h2>This is the card for {member.name}</h2>
    </div>
    );
}

export default Card;