# shopping_list
A user centric shared shopping list. Does one thing and does it well.

# Sitewide SSO
The bistrom.fi site uses a session cookie which you recieve on login to the root domain

# Session persistence
The session cookie is extended on each visit if you have a valid session from before stored in the database. 
Device fingerprints and IPs are used so if you swap devices or browsers or ip using VPN you will need to log in again.