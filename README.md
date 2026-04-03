export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GHL_API_KEY   = process.env.GHL_API_KEY;
  const LOCATION_ID   = process.env.GHL_LOCATION_ID || '7ICxlqy4mXPvJse3J4gc';
  const PIPELINE_ID   = process.env.GHL_PIPELINE_ID || 'pit-42e899f4-b486-411c-af09-51ea94bd7376';
  const STAGE_ID      = process.env.GHL_STAGE_ID    || '';

  if (!GHL_API_KEY) {
    return res.status(500).json({ error: 'GHL_API_KEY not configured' });
  }

  try {
    const body = req.body || {};
    const { first_name, last_name, phone, email, service, message } = body;

    if (!first_name || !phone) {
      return res.status(400).json({ error: 'First name and phone are required' });
    }

    const headers = {
      'Authorization': `Bearer ${GHL_API_KEY}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    };

    // 1. Create Contact
    const contactPayload = {
      locationId: LOCATION_ID,
      firstName: first_name,
      lastName: last_name || '',
      phone: phone,
      email: email || '',
      tags: ['godhans-website', 'free-estimate-request'],
      customFields: [
        { key: 'service_requested', field_value: service || '' },
        { key: 'project_details',   field_value: message || '' }
      ],
      source: 'godhandstreeservice.com'
    };

    const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers,
      body: JSON.stringify(contactPayload)
    });

    const contactData = await contactRes.json();

    if (!contactRes.ok) {
      console.error('GHL contact error:', contactData);
      return res.status(502).json({ error: 'Failed to create contact', detail: contactData });
    }

    const contactId = contactData.contact?.id;

    // 2. Create Opportunity (if we have pipeline + stage + contact)
    if (contactId && PIPELINE_ID && STAGE_ID) {
      const oppName = `${first_name} ${last_name || ''} - ${service || 'Free Estimate'}`.trim();
      const oppPayload = {
        pipelineId: PIPELINE_ID,
        locationId: LOCATION_ID,
        name: oppName,
        pipelineStageId: STAGE_ID,
        contactId: contactId,
        status: 'open',
        source: 'godhandstreeservice.com'
      };

      const oppRes = await fetch('https://services.leadconnectorhq.com/opportunities/', {
        method: 'POST',
        headers,
        body: JSON.stringify(oppPayload)
      });

      if (!oppRes.ok) {
        const oppErr = await oppRes.json();
        console.error('GHL opportunity error:', oppErr);
        // Don't fail the whole request — contact was created successfully
      }
    }

    return res.status(200).json({
      success: true,
      contactId,
      message: 'Estimate request received'
    });

  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Internal error', detail: String(err) });
  }
}
