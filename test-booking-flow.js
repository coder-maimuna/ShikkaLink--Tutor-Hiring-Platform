/**
 * Booking Flow Verification Script
 * Tests the complete booking flow from availability to session creation
 */

const axios = require('axios');
const BASE_URL = 'http://localhost:5000';

// Test data
const TEST_DATA = {
  tutorId: 2, // Using tutor ID 2 (Tahasina Tasnim Afra) for testing
  studentId: 1, // Using student ID 1 for testing
  token: null,
  sessionId: null
};

console.log('='.repeat(60));
console.log('BOOKING FLOW VERIFICATION');
console.log('='.repeat(60));
console.log();

async function test1_TutorProfile() {
  console.log('Step 1: Test Tutor Profile Endpoint');
  console.log('-'.repeat(60));
  try {
    const response = await axios.get(`${BASE_URL}/api/tutor/profile/${TEST_DATA.tutorId}`);
    console.log('✓ Tutor Profile Endpoint: SUCCESS');
    console.log(`  Response:`, JSON.stringify(response.data, null, 2).substring(0, 200));
    return true;
  } catch (error) {
    console.log('✗ Tutor Profile Endpoint: FAILED');
    console.log(`  Error: ${error.message}`);
    return false;
  }
}

async function test2_GetAvailability() {
  console.log('\nStep 2: Test Get Tutor Availability Endpoint');
  console.log('-'.repeat(60));
  try {
    const response = await axios.get(`${BASE_URL}/api/tutor/${TEST_DATA.tutorId}/availability`);
    if (response.data.success) {
      console.log('✓ Availability Endpoint: SUCCESS');
      console.log(`  Available slots: ${response.data.availability.length}`);
      if (response.data.availability.length > 0) {
        console.log('  Sample slot:', JSON.stringify(response.data.availability[0], null, 2));
      }
      return response.data.availability;
    } else {
      console.log('✗ Availability Endpoint: FAILED');
      console.log(`  Message: ${response.data.message}`);
      return [];
    }
  } catch (error) {
    console.log('✗ Availability Endpoint: FAILED');
    console.log(`  Error: ${error.message}`);
    return [];
  }
}

async function test3_CreateSession() {
  console.log('\nStep 3: Test Create Session Endpoint (requires authentication)');
  console.log('-'.repeat(60));

  if (!TEST_DATA.token) {
    console.log('✗ Create Session: SKIPPED (no authentication token)');
    console.log('  To test: Login as student, get token, and retry');
    return null;
  }

  try {
    const sessionData = {
      tutor_id: TEST_DATA.tutorId,
      subject: 'Mathematics',
      scheduled_time: '2026-08-04T10:00:00Z', // Test slot
      duration_minutes: 60
    };

    const response = await axios.post(`${BASE_URL}/api/sessions`, sessionData, {
      headers: { Authorization: `Bearer ${TEST_DATA.token}` }
    });

    if (response.data.success) {
      console.log('✓ Create Session: SUCCESS');
      console.log(`  Session ID: ${response.data.session.session_id}`);
      console.log(`  Tutor: ${response.data.session.tutor.full_name}`);
      console.log(`  Subject: ${response.data.session.subject}`);
      console.log(`  Scheduled Time: ${response.data.session.scheduled_time}`);
      console.log(`  Status: ${response.data.session.status}`);
      TEST_DATA.sessionId = response.data.session.session_id;
      return response.data.session;
    } else {
      console.log('✗ Create Session: FAILED');
      console.log(`  Message: ${response.data.message}`);
      return null;
    }
  } catch (error) {
    console.log('✗ Create Session: FAILED');
    console.log(`  Error: ${error.response?.data?.message || error.message}`);
    return null;
  }
}

async function test4_GetStudentSessions() {
  console.log('\nStep 4: Test Get Student Sessions Endpoint');
  console.log('-'.repeat(60));

  if (!TEST_DATA.token) {
    console.log('✗ Get Student Sessions: SKIPPED (no authentication token)');
    console.log('  To test: Login as student, get token, and retry');
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}/api/student/sessions`, {
      headers: { Authorization: `Bearer ${TEST_DATA.token}` }
    });

    if (response.data.success) {
      console.log('✓ Get Student Sessions: SUCCESS');
      console.log(`  Total sessions: ${response.data.total}`);
      if (response.data.sessions.length > 0) {
        console.log('\n  Sessions:');
        response.data.sessions.forEach((session, index) => {
          console.log(`    ${index + 1}. ${session.tutor_name} - ${session.subject} (${session.status})`);
          console.log(`       Time: ${new Date(session.scheduled_time).toLocaleString()}`);
        });
        return response.data.sessions;
      } else {
        console.log('  No sessions found');
        return [];
      }
    } else {
      console.log('✗ Get Student Sessions: FAILED');
      console.log(`  Message: ${response.data.message}`);
      return [];
    }
  } catch (error) {
    console.log('✗ Get Student Sessions: FAILED');
    console.log(`  Error: ${error.response?.data?.message || error.message}`);
    return [];
  }
}

async function test5_VerifyDatabase() {
  console.log('\nStep 5: Verify Database (manual verification required)');
  console.log('-'.repeat(60));
  console.log('✓ Manual Verification Required');
  console.log('  To verify manually:');
  console.log('  1. Connect to MySQL database:');
  console.log('     mysql -uroot -pafra shikkalink');
  console.log('  2. Check sessions table:');
  console.log('     SELECT * FROM sessions ORDER BY session_id DESC LIMIT 5;');
  console.log('  3. Look for:');
  console.log('     - session_id (auto-increment)');
  console.log('     - tutor_id =', TEST_DATA.tutorId);
  console.log('     - subject = Mathematics');
  console.log('     - status = upcoming');
  console.log('     - scheduled_time');
  return true;
}

async function runTests() {
  console.log('Starting Booking Flow Verification...\n');

  // Test 1: Tutor Profile
  const tutorProfileOk = await test1_TutorProfile();

  // Test 2: Get Availability
  const availability = await test2_GetAvailability();

  // Test 3: Create Session (requires auth)
  await test3_CreateSession();

  // Test 4: Get Student Sessions (requires auth)
  await test4_GetStudentSessions();

  // Test 5: Verify Database
  await test5_VerifyDatabase();

  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  console.log('Please note: Most endpoints require authentication.');
  console.log('To complete full testing:');
  console.log('1. Login as a student to get a JWT token');
  console.log('2. Set TEST_DATA.token with the JWT token in this script');
  console.log('3. Re-run the tests');
  console.log('='.repeat(60) + '\n');
}

runTests().catch(console.error);
