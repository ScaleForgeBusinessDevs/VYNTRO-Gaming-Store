import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually if not loaded
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [k, ...v] = trimmed.split('=');
        const val = v.join('=').trim();
        if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
        if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY') serviceRoleKey = val;
      }
    });
  }
}

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const [,, command, emailArg, passwordArg] = process.argv;

async function main() {
  console.log('\n🛡️  VYNTRO Admin Credentials Manager');
  console.log('====================================');

  if (!command || command === 'help') {
    printHelp();
    return;
  }

  if (command === 'list') {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('❌ Failed to list users:', error.message);
      return;
    }
    console.log(`📋 Total Registered Users: ${data.users.length}`);
    data.users.forEach((u, i) => {
      console.log(`   ${i + 1}. Email: ${u.email} | ID: ${u.id} | Confirmed: ${u.email_confirmed_at ? 'YES' : 'NO'}`);
    });
    return;
  }

  if (command === 'create') {
    if (!emailArg || !passwordArg) {
      console.error('❌ Usage: node scripts/admin-user.mjs create <email> <password>');
      return;
    }
    console.log(`⏳ Creating user: ${emailArg}...`);
    const { data, error } = await supabase.auth.admin.createUser({
      email: emailArg.trim(),
      password: passwordArg,
      email_confirm: true,
    });

    if (error) {
      console.error('❌ Error creating user:', error.message);
      return;
    }
    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${data.user.email}`);
    console.log(`   User ID: ${data.user.id}`);
    console.log(`\nYou can now log in at: http://localhost:3000/admin/login`);
    return;
  }

  if (command === 'reset') {
    if (!emailArg || !passwordArg) {
      console.error('❌ Usage: node scripts/admin-user.mjs reset <email> <newPassword>');
      return;
    }
    console.log(`⏳ Searching for user: ${emailArg}...`);
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('❌ Error looking up user:', listError.message);
      return;
    }

    const user = listData.users.find((u) => u.email.toLowerCase() === emailArg.trim().toLowerCase());
    if (!user) {
      console.error(`❌ No user found with email: ${emailArg}`);
      console.log(`💡 Run "node scripts/admin-user.mjs list" to see existing users.`);
      return;
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      password: passwordArg,
    });

    if (updateError) {
      console.error('❌ Error resetting password:', updateError.message);
      return;
    }

    console.log(`✅ Password reset successfully for: ${emailArg}`);
    console.log(`You can now log in with your new password at: http://localhost:3000/admin/login`);
    return;
  }

  if (command === 'delete') {
    if (!emailArg) {
      console.error('❌ Usage: node scripts/admin-user.mjs delete <email>');
      return;
    }
    const { data: listData } = await supabase.auth.admin.listUsers();
    const user = listData?.users.find((u) => u.email.toLowerCase() === emailArg.trim().toLowerCase());
    if (!user) {
      console.error(`❌ No user found with email: ${emailArg}`);
      return;
    }
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      console.error('❌ Error deleting user:', error.message);
      return;
    }
    console.log(`✅ Deleted user: ${emailArg}`);
    return;
  }

  console.error(`❌ Unknown command: "${command}"`);
  printHelp();
}

function printHelp() {
  console.log(`
Commands:
  node scripts/admin-user.mjs list
    List all current users

  node scripts/admin-user.mjs create <email> <password>
    Create a new confirmed admin user

  node scripts/admin-user.mjs reset <email> <newPassword>
    Reset the password for an existing user

  node scripts/admin-user.mjs delete <email>
    Delete an admin user
`);
}

main().catch(console.error);
