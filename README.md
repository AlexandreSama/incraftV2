
# 📦 Plan de Déploiement – Application Harmonia

## 🗂️ Sommaire

1. [Pré-requis](#pré-requis)
2. [Architecture de l'application](#architecture-de-lapplication)
3. [Étapes de déploiement](#étapes-de-déploiement)
4. [Gestion des configurations](#gestion-des-configurations)
5. [Mise en production](#mise-en-production)
6. [Rollback (repli)](#rollback-repli)

---

## ✅ Pré-requis

- Java 21 (ou compatible avec Spring Boot)
- MySQL 8+ (ou équivalent)
- Serveur Tomcat 9+ (si déploiement `.war`)
- Serveur local ou distant avec accès SSH/FTP

---

## 🏗️ Architecture de l'application

- **Backend (API)** : Spring Boot + MySQL
- **Frontend (WEB)** : Spring Boot + Thymeleaf
- **Communication** : WEB ↔ API via HTTP (port 8082)
- **Mode de déploiement** :
  - Fichier `.jar` exécutable
  - ou `.war` déployé sur Tomcat

---

## 🚀 Étapes de déploiement

 1. Récupération du projet

- Télécharger le ``.jar`` de la dernière release qui se trouve dans la rubrique "**Releases**" de chaque repository
	- [pour le côté API](https://github.com/BenjaminPlumejeau-afpa/Harmonia_API/releases)
	- [Pour le côté WEB]( https://github.com/AlexandreSama/Harmonia-web)

2. Préparation de la Base de Données

 - Créer une base de données ``harmonia`` sur MySQL
 - Vérifier l'encodage : ``utf8mb4``
 - Aucun script manuel requis si ``spring.jpa.hibernate.dll-auto=update``

 ---
 
## ⚙️ Gestion des configurations

**📄``application.properties`` - côté WEB**
```properties
spring.application.name=Harmonia
# Remplacer <PORT_WEB> par le port souhaité pour l'application WEB (exemple : 8081)
server.port=<PORT_WEB>

# Logs
logging.file.path=logs
logging.level.root=error
logging.level.fr.harmonia=info
logging.level.org.springframework.data=INFO
logging.level.org.springframework.jdbc.core.JdbcTemplate=DEBUG
logging.level.org.springframework.boot.web.embedded.tomcat=INFO

# URL de l'API
# Remplacer <API_URL> par l'URL de votre API (exemple : http://localhost:<PORT_API>)
fr.afpa.harmonia.apiURL=<API_URL>

# Gestion des erreurs
server.error.path=/error
server.error.whitelabel.enabled=false
```
**📄``application.properties`` - côté API**
```properties
spring.application.name=EcoleMusique_API
# Remplacer <PORT_API> par le port souhaité pour l'API (exemple : 8082)
server.port=<PORT_API>

# Base de données MySQL
# Remplacer l'URL par celle de votre instance MySQL si nécessaire
spring.datasource.url=jdbc:mysql://localhost:3306/harmonia
# Remplacer '<USERNAME>' par le nom d'utilisateur MySQL correspondant
spring.datasource.username=<USERNAME>
# Remplacer '<PASSWORD>' par le mot de passe associé à l'utilisateur MySQL
spring.datasource.password=<PASSWORD>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate
spring.jpa.hibernate.ddl-auto=update
```

---

## 🛠️ Mise en production

 1. **Sauvegarde** éventuelle de l'ancienne version et de la base de données.
 2. Vérifier que les fichiers ``application.properties`` sont bien configurés.
3. **Mode de déploiement** :
  - Pour un ``.jar`` :
	  ```bash
	  java -jar target/nom-du-projet-0.0.1-SNAPSHOT.jar
	  ```
- Pour un `.war` :
	-  Copier le fichier ``.war`` dans un dossier ``webapps`` de Tomcat.
	- Redémarrer Tomcat :
		```bash
		sudo systemctl restart tomcat
		```
4. Vérifier dans le navigateur :
	- Interface WEB : [http://localhost:8081](http://localhost:8081)
	- API REST : [http://localhost:8082](http://localhost:8082)

---

## ⏪ Rollback (repli)

En cas de problème après déploiement :
- Remettre l'ancienne version ``.jar`` ou ``.war``
- Restaurer une sauvegarde de la base si nécessaire
- Redémarrer le serveur Tomcat ou relancer l'application :
```bash
java -jar ancien-fichier.jar
```

---

## ✉️ Contact / Support

- *Développeurs principaux* : 
	- Alexandre - [alexandretest12@gmail.com](alexandretest12@gmail.com)
	- Benjamin - [benjamintest12@gmail.com](benjamintest12@gmail.com)
	- Noemie - [noemietest12@gmail.com](noemietest12@gmail.com)
	- Nicolas - [nicolastest12@gmail.com](nicolastest12@gmail.com)
- *Repository Git* : 
	- Côté WEB : [Harmonia-WEB](https://github.com/AlexandreSama/Harmonia-web)
	- Côté API : [Harmonia-API](https://github.com/BenjaminPlumejeau-afpa/Harmonia_API)
