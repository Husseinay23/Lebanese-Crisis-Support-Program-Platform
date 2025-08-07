# Lebanese Crisis Support Program Platform

Designed by Hussein Ayoub, Abed El Nabi Koubeissy, and Mohamed Zabad,  
this project aims to support Lebanese people displaced and suffering due to the ongoing crisis.

The platform connects people in need with resources, donations, and support services, offering an easy-to-use interface, real-time news, and a community-driven help system.

---

## 🌟 Features

- **Needs and Wants System:**  
  - Request or offer help via forms  
  - Categorized and filtered listings of items  
  - "Help Now" button to quickly contact donors or requesters  
  - Store feature to purchase items for personal use or donation  
  - Search bar with filtering for offered items

- **Support Services Directory:**  
  - Connects users to individuals or organizations offering help  
  - Search and match service options  
  - Info-graphics using Google Maps API showing nearby resources

- **News Integration:**  
  - Real-time news updates from multiple sources via APIs  
  - Keeps users informed about current events

- **Organizations Directory:**  
  - List of organizations for donations, volunteering, or alerts  
  - Ability to contribute resources or report urgent news

- **User Accessibility:**  
  - Dark/Light mode toggle  
  - Language translation (Arabic, English, French)

- **User Accounts:**  
  - Signup/login authentication  
  - Account management: profile, location, phone, etc.  
  - Activity tracking and account deletion

- **Admin Page:**  
  - Admin can add sections, features, or data  
  - User accounts monitoring and management

---

## 🧰 Tech Stack

- **Backend:** Python, Django, Django REST Framework, SQLite3  
- **Frontend:** React, Vite  
- **APIs:** Google Maps, News APIs  
- **Authentication:** JWT (JSON Web Tokens)  
- **Others:** Pillow (image handling), django-cors-headers

---

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend folder:

    ```bash
    cd Backend
    ```

2. Create and activate a Python virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3. Upgrade pip and install dependencies:

    ```bash
    pip install --upgrade pip
    pip install -r requirements.txt
    ```

4. Run the Django development server:

    ```bash
    python manage.py runserver
    ```

5. Access the admin panel at [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)  
   - Username: `lol`  
   - Password: `123`

---

### Frontend Setup

1. Navigate to the frontend folder:

    ```bash
    cd ../Front-end
    ```

2. Clean old dependencies and install fresh:

    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```

3. Run the frontend server:

    ```bash
    npm run dev
    ```

4. Open the link provided in terminal (usually http://localhost:5173) to access the app.

---

## 📁 Project Structure (high level)
``` 
Backend/
├── manage.py
├── Crisis/ # Django project settings
├── api/ # Django apps and APIs
├── requirements.txt
├── venv/ # Python virtual environment

Front-end/
├── src/ # React source files
├── public/
├── package.json
├── vite.config.js
├── node_modules/
``` 



---

## 👨‍💻 Authors

- Hussein Ayoub  
- Abed El Nabi Koubeissy  
- Mohamed Zabad

---
