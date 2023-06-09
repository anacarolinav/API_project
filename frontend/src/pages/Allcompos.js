import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyledButton, StyledSubTitle } from '../components/Styles';
import { Form } from "protected-aidaforms";
import { replaceValuesJDT } from "../ReplaceValuesJDT";

let jdt = require("../jdt.json");
let style = require('../style_admissao.json');

const AllCompositions = () => {
    const [compositions, setCompositions] = useState(null);
    const [selectedComposition, setSelectedComposition] = useState(null);
    const [error, setError] = useState(null);
    const [newjdt, setNewjdt] = useState(null);

    useEffect(() => {
        const getCompositions = async () => {
            try {
                const response = await axios.get(`/alljson/${selectedComposition?.user}`);
                const compositionData = response.data;
                setCompositions(compositionData);
                setError(null);
            } catch (error) {
                setCompositions([]);
                setError('Error: ' + error.message);
            }
        };

        getCompositions();
    }, [selectedComposition]);

    const handleCompositionClick = (composition) => {
        setSelectedComposition(composition);

        let newjdt = replaceValuesJDT(jdt, composition.items);
        setNewjdt(newjdt);
        console.log("CLIQUEI", composition.items);
    };

    if (error) {
        return <div>{error}</div>; // Exibe a mensagem de erro se ocorrer um erro ao obter as composições
    }

    return (
        <div>
            <h1 style={{ color: 'white', fontSize: '45px', textAlign: 'center', padding: '5px', marginBottom: '18px' }}>Episodes</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridGap: '10px' }}>
                {Array.isArray(compositions) && compositions.map((composition, index) => (
                    <StyledButton
                        key={index}
                        style={{ border: '2px solid #ccc', borderRadius: '5px', padding: '20px', marginBottom: '10px' }}
                        onClick={() => handleCompositionClick(composition)}
                    >
                        Episode {index + 1}
                    </StyledButton>
                ))}
            </div>

            {newjdt && (
                <div>
                    <StyledSubTitle style={{ marginTop: '50px', fontSize: '30px' }}>Informations about the episode:</StyledSubTitle>
                    <Form
                        onSubmit={(values, changedFields) => console.log("SUBMITTED VALUES: ", values, "CHANGED FIELDS: ", changedFields)}
                        onSave={(values, changedFields) => console.log("SAVED VALUES: ", values, "CHANGED FIELDS: ", changedFields)}
                        onCancel={status => console.log("CANCELLED:", status)}
                        template={newjdt}
                        dlm={{}}
                        showPrint={true}
                        editMode={false}
                        professionalTasks={["Registar Pedido", "Consultar Pedido", "Anular Pedido"]}
                        canSubmit={true}
                        canSave={true}
                        canCancel={true}
                        patientData={{}}
                        reportData={{}}
                        referenceModel={[]}
                        submitButtonDisabled={false}
                        saveButtonDisabled={false}
                        formDesign={JSON.stringify(style)}
                    />
                </div>
            )}
        </div>
    );
};

export default AllCompositions;


