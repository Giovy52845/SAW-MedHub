
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './benefitcard.css'

export default function BenefitCard({icon, title, subtitle}) {
    return (
        <div className='benefits-div col-lg-3 col-12 col-md-6 mb-3'>
            <p className='benefits-title'> 
                <FontAwesomeIcon icon = {icon} color='#00c3a5'/>
                {title}
            </p>
            <p className='benefits-sub-title'> 
               {subtitle}
            </p>
        </div>
    );

}