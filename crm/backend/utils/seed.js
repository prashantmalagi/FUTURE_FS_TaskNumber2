const User = require('../models/User');
const Lead = require('../models/Lead');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const existing = await User.findOne({ email: adminEmail });
    
    if (!existing) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
      
      // Seed sample leads for demo
      await seedSampleLeads();
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
};

const seedSampleLeads = async () => {
  const sampleLeads = [
    { name: 'Alice Johnson', email: 'alice@techcorp.com', phone: '+1-555-0101', company: 'TechCorp', source: 'website', status: 'new', priority: 'high', message: 'Interested in enterprise plan', value: 15000 },
    { name: 'Bob Martinez', email: 'bob@startupxyz.io', phone: '+1-555-0102', company: 'StartupXYZ', source: 'referral', status: 'contacted', priority: 'medium', message: 'Looking for team collaboration tools', value: 5000 },
    { name: 'Carol White', email: 'carol@designstudio.com', phone: '+1-555-0103', company: 'Design Studio', source: 'social_media', status: 'qualified', priority: 'high', message: 'Needs custom implementation', value: 25000 },
    { name: 'David Lee', email: 'david@retail.com', phone: '+1-555-0104', company: 'Lee Retail', source: 'email_campaign', status: 'converted', priority: 'low', message: 'Small business needs', value: 2500 },
    { name: 'Emma Davis', email: 'emma@consulting.net', phone: '+1-555-0105', company: 'Davis Consulting', source: 'website', status: 'new', priority: 'medium', message: 'Evaluating CRM solutions', value: 8000 },
    { name: 'Frank Wilson', email: 'frank@manufact.co', phone: '+1-555-0106', company: 'Wilson Manufacturing', source: 'cold_call', status: 'lost', priority: 'low', message: 'Budget constraints', value: 0 },
    { name: 'Grace Kim', email: 'grace@healthplus.org', phone: '+1-555-0107', company: 'HealthPlus', source: 'website', status: 'contacted', priority: 'high', message: 'HIPAA compliance required', value: 20000 },
    { name: 'Henry Brown', email: 'henry@financegroup.com', phone: '+1-555-0108', company: 'Finance Group', source: 'referral', status: 'new', priority: 'medium', message: 'Looking for automation features', value: 12000 },
  ];

  await Lead.insertMany(sampleLeads);
  console.log(`✅ Sample leads created`);
};

module.exports = { seedAdmin };
