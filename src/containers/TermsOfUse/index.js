import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Container, Image, List } from  'semantic-ui-react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import '../../style/css/style.css';

const TermsOfUse = withRouter(({ location, user }) => {
	return (
    <Container fluid>
      <Grid centered verticalAlign="middle">
        <Grid.Row className="mainLogin p-0">
          <Grid.Column mobile={16} tablet={8} computer={9} style={{ padding: 0}}>
            <div className="blueBg">
              <Image src='images/logo.png' size='medium' as="a" href="/"/>
              <h1 className="pt-15  text-white">Welcome To</h1>
              <p>ShareCabs</p>
            </div>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={7} style={{ padding: 0}}>
            <div className="plainTextContent">
              <h1>Terms Of Use</h1>
              <div>
                Lorem ipsum dolor sit amet, pro solum option ex, tantas tibique nam ea. Cum ex graeci pericula, congue mollis maiestatis eum eu, solum ullum mea at. Populo phaedrum assueverit sed ad, nam at idque minimum partiendo. Eu labores eleifend nam, at cum ubique indoctum, vel apeirian electram suscipiantur ei. Pri ad cetero nusquam. Qui liber definiebas ea, eam ex equidem propriae offendit.
    
                No viris salutandi mel. Et munere conceptam vel, te pericula expetenda eos. Qui te vero putent adipiscing, quo nibh officiis ea, posse suscipit delicata per no. Sumo essent eloquentiam duo ut, ut vis nonumy meliore, atqui patrioque consequuntur sit id. Eum veritus assentior ex, vocent suavitate molestiae mea ex, nulla dicant sit ad. Eu essent intellegat eam.
    
                Has ut partiendo argumentum, vocent argumentum eum ne. Et vel ferri constituam, aliquando prodesset ex vix. Vim an sale prodesset, reque intellegat cu ius. Cu mea error aperiri oportere, quo maiorum corrumpit forensibus ea. Vix no vidit veritus admodum. Eripuit eruditi definiebas ei duo.
    
                Mollis luptatum mel ne. Et assum salutandi honestatis ius. Cu his errem maluisset quaerendum, liber reprehendunt at ius, no mea nibh mentitum sensibus. Salutandi corrumpit intellegebat ad vix, ex cum virtute disputando. Ad meliore disputationi pri. Ut sed latine regione, tota prompta commune te sea.
    
                In sea meliore consequat democritum, in solum facete aliquip nec, eam minim liber gubergren id. Sit iusto sonet perfecto ad, ei dicam iisque eos, adipisci vulputate rationibus at pri. Quo nostrud hendrerit ad, an nec vocent percipitur, at iriure dolorem sea. Imperdiet euripidis an mel, no per facilisis repudiandae complectitur. Tollit vocibus in mei, veri dissentiet concludaturque te nam. Per purto vivendum abhorreant et, nibh nihil repudiare has ei. His ad harum doctus consequuntur, cum ex unum sale legimus.
              </div>
            </div>
            <div className="footer">
              <List horizontal>
                <List.Item>
                  <List.Content>
                    <List.Header as="a" href="/terms-of-use">Term of Use</List.Header>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Content>
                    <List.Header as="a" href="/privacy-policy">Privacy Policy</List.Header>
                  </List.Content>
                </List.Item>
              </List>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
	);
});

TermsOfUse.propTypes = {
	user: PropTypes.object,
};

TermsOfUse.defaultProps = {
	user: null
};

export default connect(state => ({
	user: state.get('auth').get('user'),
}))(TermsOfUse);