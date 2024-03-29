import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
import './Card.css';

function Card() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [member, setMember] = useState({
        name: '',
        job: '',
        contact: '',
        image: ''
    }); 
    const [whatsapp, setWhatsapp] = useState(''); 
  
    function formatMobile() {
        let number = member.mobile;
        number = number.split('-');
        let formatedNumber = '+55 ('+number[0]+') '+number[1]+'-'+number[2];
        let link = 'https://wa.me/+55'+number[0]+number[1]+number[2];
        setMobile(formatedNumber);
        setWhatsapp(link);
    }

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

    useEffect(() => {        
        if (member.mobile) {
            let number = member.mobile || '(21) 99918-6842';
            number = number.replace(/\D/g, '')
            setWhatsapp('https://wa.me/+55'+number);
        }
    }, [member]);

    return (
        <div className="card-page">
            <div className="card-front opacity-bounce">

                <div className="card-header">
                    <div className='card-head'>
                        <img className="card-logo" src="/img/logo.png"/> 
                    </div>           
                </div>


                <div className='card-avatar'>
                    <img className='card-avatar-image' src={member.image ? member.image : '/img/icon.png'}/> 
                </div>
                <div className='card-avatar-cover inverse-opacity-change'></div>

                <div className="card-title">
                    <div className="card-name">{member.name}</div>
                    <div className="card-job">{member.job}</div>              
                </div>

                <div className="card-infos">

                    <div className='card-info-section'>
                        <div className='card-info-icon-wrapper'>
                            <img className='card-info-icon'src='/img/telephone.svg'/>
                        </div>
                        <div className='card-info'>
                            <div className='card-info-text'>
                                {member.mobile ? member.mobile : '+55 (21) 3078-3363'} <span className={member.mobile ? 'visible' : 'none'}>- <a href={whatsapp} className={member.mobile ? "card-info-text" : 'none'}>
                                WhatsApp<img className='card-icon' src="/img/link.svg"/></a></span>
                            </div>
                            <div className="card-info-text">{member.contact}</div>
                            
                        </div>
                    </div>

                    <div className='card-info-section'>
                        <div className='card-info-icon-wrapper'>
                            <img className='card-info-icon'src='/img/web.svg'/>
                        </div>
                        <div className='card-info'>
                            <div className="card-info-text">Visite nosso site:</div>
                            <a className="card-info-text" onClick={() => navigate('/')}>
                                wwww.dantassilva.com.br<img className='card-icon' src="/img/link.svg"/>
                            </a>
                        </div>
                    </div>

                    <div className='card-info-section'>
                        <div className='card-info-icon-wrapper'>
                            <img className='card-info-icon'src='/img/address.svg'/>
                        </div>
                        <div className='card-info card-underline'>
                            <div className="card-info-text">
                                Rua da Quitanda, 60 – 12º andar
                            </div>
                            <div className="card-info-text">
                                Centro - Rio de Janeiro - <a href="https://www.google.com/maps/place/R.+da+Quitanda,+60+-+12º+andar+-+Centro,+Rio+de+Janeiro+-+RJ,+20011-030/@-22.90355,-43.1792889,17z/data=!3m1!4b1!4m5!3m4!1s0x997f5f1b1adb07:0x9ebef1fb5678764!8m2!3d-22.903555!4d-43.176714?entry=tts" target="_blank">
                                    Mapa<img className='card-icon' src="/img/link.svg"/>
                                    </a>
                            </div>



                            <a className="card-info-text" style={{fontSize: '12px'}}
                            href="https://www.google.com/maps/place/R.+da+Quitanda,+60+-+12º+andar+-+Centro,+Rio+de+Janeiro+-+RJ,+20011-030/@-22.90355,-43.1792889,17z/data=!3m1!4b1!4m5!3m4!1s0x997f5f1b1adb07:0x9ebef1fb5678764!8m2!3d-22.903555!4d-43.176714?entry=tts" target="_blank"></a>

                        </div>
                    </div>
                </div>
            </div>   
            <div className='blur'></div>     
        </div>
    );
}

export default Card;