import React from 'react';
import { Row, Col } from 'reactstrap';

export default function ModalDetalhes({ conteudo }) {

   return (
      <div>
         <Row>
            <Col md={5} style={{ marginBottom: 15 }}>
               <strong>Cliente: {conteudo.cliente}</strong>
            </Col>

            <Col md={4} style={{ marginBottom: 15 }}>
               <strong>Assunto: {conteudo.assunto}</strong>
            </Col>

            <Col md={3} style={{ marginBottom: 15 }}>
               <strong>Data: {conteudo.createdFormat}</strong>
            </Col>

            <Col md={12} style={{ marginBottom: 15 }}>
               <strong>Observação: {!conteudo.observacao === 'Nenhuma observação!'}</strong>
               {conteudo.observacao && (
                  <textarea style={{ width: '100%', height: 150, padding: 20, marginTop: 5 }} disabled={true} placeholder={conteudo.observacao}>
                     {conteudo.observacao}
                  </textarea>
               )}
            </Col>

            <Col md={12} style={{ display: 'flex', gap: 10 }}>
               <strong>Status:</strong>
               <strong className='badge' style={{ backgroundColor: conteudo.status === 'Aberto' ? '#157347' : '#999' }}>{conteudo.status}</strong>
            </Col>
         </Row>


      </div>
   );
}