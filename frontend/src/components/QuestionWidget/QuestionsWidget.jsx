import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import { getListaDomandeWidget } from '../../api/api';

import './question_widget.css'


export default function QuestionsWidgets() {

    const [listaDomande, setListaDomande] = useState([]);

    useEffect(() => {
        getListaDomandeWidget()
            .then((data) => setListaDomande(data))
            .catch((err) => console.error("Errore: ", err));
    }, []);

    return (
        <div className='question col-12 col-lg-6 col-md-12'>
            <div className='question-title'>
                <h3>La parola dei dottori</h3>
            </div>
            {listaDomande.map((item) => {
                const hasAnswer = !!item.risposte;
                return (
                    <QuestionAnswers 
                        key={item.id_message}
                        idDomanda={item.id_message}
                        question={item.message}
                        name_doc={hasAnswer ? item.risposte.nome_medico : ''}
                        img_doc={hasAnswer ? item.risposte.img_doc : ''}
                        answer={hasAnswer ? item.risposte.messaggio_risposta : "In attesa di risposta"}
                        hasAnswer={hasAnswer}
                    />
                );
            })}
        </div>
    );
}

function QuestionAnswers({ idDomanda, question, name_doc, img_doc, answer, hasAnswer }) {
    return (
        <div className="qa-card">
            <div className="qa-question">
                <Link to={`/domande-risposte/${idDomanda}`} className='truncate-multiline'>
                    {question}
                </Link>
            </div>

            {hasAnswer ? (
                <>
                    <span className='qa-text'>RISPOSTA DEL DOTTORE:</span>
                    <div className="qa-response">
                        <div className="qa-picture">
                            <Link to={"/"}>
                                <img src={img_doc} alt="Foto del medico" />
                            </Link>
                        </div>
                        <div className="qa-response-doc">
                            <div className="qa-doc">
                                <Link to={"/"}>
                                    {name_doc}
                                </Link>
                                <p className='truncate-multiline'>{answer}</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <span className='qa-text'>In attesa di risposta...</span>
            )}
        </div>
    );
}