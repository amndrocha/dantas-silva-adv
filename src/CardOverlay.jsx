import { useEffect, useState } from 'react';
import './Card.css';

function CardOverlay({data}) {
    const [member, setMember] = useState({
        name: '',
        contact: '',
        job: '',
    }); 
    const [whatsapp, setWhatsapp] = useState('');


    useEffect(() => {
        if (data) {
            setMember(data)
            let number = data.mobile || '(21) 99918-6842';
            number = number.replace(/\D/g, '')
            setWhatsapp('https://wa.me/+55'+number);
        }
    }, [data]);

    const preventClick = (e) => {
        e.stopPropagation();
    }
    
    const close = () => {
        window.dispatchEvent(new Event('close-card'));
    }

    const copyURL = (e) => {   
        e.preventDefault();     
        //navigator.clipboard.writeText('dantassilva.net/card/'+member.id);
        //alert('O link foi copiado para a área de transferência!');
    }

    return (
        <div className={data ? "card-page opacity-change" : 'none'} style={{backgroundColor: '#000000e4'}}
        onClick={close}>
            <div className={data ? "card-front bounce" : 'none'} onClick={(e) => preventClick(e)}>

                <div className="card-header">
                    <div className='card-head'>
                        <img className="card-logo" src="/img/logo.png"/> 
                    </div>           
                </div>


                <div className='card-avatar' onClick={(e) => copyURL(e)}>
                    <img className='card-avatar-image' src={member.image ? member.image : '/img/icon.png'}/> 
                </div>

                <div className="card-title">
                    <div className="card-name">{member.name}</div>
                    <div className="card-job">{member.job}</div>              
                </div>

                <div className="card-infos">

                    <div className={member.mobile ? 'card-info-section' : 'none'}>
                        <div className='card-info-icon-wrapper'>
                            <img className='card-info-icon'src='/img/telephone.svg'/>
                        </div>
                        <div className='card-info'>
                            <div className='card-info-text'>+55 {member.mobile}</div>
                            <a href={whatsapp} className="card-info-text">
                                WhatsApp<img className='card-icon' src="/img/link.svg"/>
                            </a>
                        </div>
                    </div>

                    <div className='card-info-section'>
                        <div className='card-info-icon-wrapper'>
                            <img className='card-info-icon'src='/img/web.svg'/>
                        </div>
                        <div className='card-info'>
                            <div className="card-info-text">{member.contact}</div>
                            <a className="card-info-text" onClick={close}>
                                Visite nosso site<img className='card-icon' src="/img/link.svg"/>
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
                <div style={{fontSize: '20px', color: 'var(--background-light)'}}>dantassilva.com.br/card/{member.id}</div>
            </div>        
        </div>
    );
}

export default CardOverlay;