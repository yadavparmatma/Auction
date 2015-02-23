rm -fr data/auction.db
rm -fr data
echo "-------------->databases removed"
mkdir data
echo "------------->>>initializing production db"
node scripts/initialize_db.js data/auction.db
sqlite3  data/auction.db < scripts/fill_sample_data.sql

