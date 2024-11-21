import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../Konfiguration/apiConstants';

const PunchOutRequest: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const sendXMLPayload = async () => {
      const xmlPayload = `<?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE cXML SYSTEM "http://xml.cxml.org/schemas/cXML/1.2.040/cXML.dtd">
        <cXML payloadID="1539050765.0492@example.com" timestamp="2018-10-09T02:06:05+00:00">
          <Header>
            <From>
              <Credential domain="NetworkId">
                <Identity>buyer</Identity>
              </Credential>
            </From>
            <To>
              <Credential domain="DUNS">
                <Identity>acme</Identity>
              </Credential>
            </To>
            <Sender>
              <Credential domain="NetworkId">
                <Identity>buyer</Identity>
                <SharedSecret>jd8je3$ndP</SharedSecret>
              </Credential>
              <UserAgent>Application Name v1.2.3</UserAgent>
            </Sender>
          </Header>
          <Request deploymentMode="production">
            <PunchOutSetupRequest operation="create">
              <BuyerCookie>550bce3e592023b2e7b015307f965133</BuyerCookie>
              <Extrinsic name="UserEmail">jdoe@example.com</Extrinsic>
              <Extrinsic name="FirstName">John</Extrinsic>
              <Extrinsic name="LastName">Doe</Extrinsic>
              <Extrinsic name="PhoneNumber">555-555-5555</Extrinsic>
              <Extrinsic name="SecretId">123456789</Extrinsic>
              <BrowserFormPost>
                <URL>https://localhost:7001/</URL>
              </BrowserFormPost>
              <ShipTo>
                <Address addressID="TEST">
                  <Name xml:lang="en">My Address</Name>
                  <PostalAddress>
                    <Street>123 Street Address</Street>
                    <City>Mountain View</City>
                    <State>CA</State>
                    <PostalCode>94040</PostalCode>
                    <Country isoCountryCode="US">US</Country>
                  </PostalAddress>
                </Address>
              </ShipTo>
            </PunchOutSetupRequest>
          </Request>
        </cXML>
      `;

      try {
        const response = await fetch(API_URL + "auth/punchOut", {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: xmlPayload,
        });

        // Zkontrolovat, zda je odpověď úspěšná
        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
          }
  
          // Získat text odpovědi
          const data = await response.text();
          console.log('XML Response:', data);
  
          // Parsovat XML odpověď
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
  
          // Získat URL z odpovědi
          const urlNode = xmlDoc.getElementsByTagName('URL')[0];
          if (!urlNode) {
            throw new Error('URL element not found in the response XML');
          }
  
          const startPageURL = urlNode.textContent || '';
          console.log('StartPage URL:', startPageURL);
  
          // Získat SID z URL
          const sidMatch = startPageURL.match(/sid=([^&]+)/);
          const sid = sidMatch ? sidMatch[1] : '';

          if (sid) {
            console.log('SID:', sid);
            // Přesměrovat na `/punchout` s SID v URL
            navigate(`/punchout?sid=${sid}`);
          } else {
            throw new Error('SID not found in StartPage URL.');
          }
        } catch (error) {
          console.error('Error sending XML payload:', error);
        }
      };

    // Po načtení komponenty odešle XML payload
    sendXMLPayload();
  }, [navigate]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-semibold text-center">PunchOut Request Component</h1>
      <p className="text-center text-gray-500">Sending XML PunchOut request on component load.</p>
    </div>
  );
};

export default PunchOutRequest;
