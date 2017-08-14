
const {expect} = require('chai')
const {Actor, Case, diagram, Note} = require('..')

describe('yUML', function () {
    describe('usecase diagrams', () => {

        it('Actor', () => {
            const Customer = new Actor('Customer')

            expect(Customer.toYUML()).to.be.equal('[Customer]')
        })

        it('Case', () => {
            const Login = new Case('Login')

            expect(Login.toYUML()).to.be.equal('(Login)')
        })

        it('Actor and Use Case', () => {
            const Login = new Case('Login')
            const Customer = new Actor('Customer')

            Customer.use(Login)

            expect(Customer.toYUML()).to.be.equal('[Customer]-(Login)')
        })

        it('Notes', () => {
            const Login = new Case('Login')
            const Customer = new Actor('Customer')

            Customer.use(Login)
            Customer.note('Cust can be registered or not{bg:beige}')

            expect(Customer.toYUML()).to.be.equal('[Customer]-(Login), [Customer]-(note: Cust can be registered or not{bg:beige})')
        })

        it('Many Use Cases', () => {
            const Login = new Case('Login')
            const Logout = new Case('Logout')
            const Customer = new Actor('Customer')

            Customer.use(Login)
            Customer.use(Logout)

            expect(Customer.toYUML()).to.be.equal('[Customer]-(Login), [Customer]-(Logout)')
        })

        it ('Actor Inheritance', () => {
            const CmsAdmin = new Actor('Cms Admin')
            const User = new Actor('User')

            CmsAdmin.inheritance(User)

            expect(CmsAdmin.toYUML()).to.be.equal('[Cms Admin]^[User]')
        })

        it('Multiple Actors And Inheritance', () => {
            const CmsAdmin = new Actor('Cms Admin')
            const User = new Actor('User')
            const Customer = new Actor('Customer')
            const Agent = new Actor('Agent')

            CmsAdmin.inheritance(User)
            Customer.inheritance(User)
            Agent.inheritance(User)

            expect(diagram(CmsAdmin, Customer, Agent)).to.be.equal('[Cms Admin]^[User], [Customer]^[User], [Agent]^[User]')
        })

        it('<<Extends>>', () => {
            const Login = new Case('Login')
            const Register = new Case('Register')
            const RequestPasswordReminder = new Case('Request Password Reminder')

            Login.extend(Register)
            Login.extend(RequestPasswordReminder)

            expect(diagram(Login)).to.be.equal('(Login)<(Register), (Login)<(Request Password Reminder)')
        })

        it('<<Includes>>', () => {
            const Register = new Case('Register')
            const ConfirmRegistration = new Case('Confirm Registration')

            Register.include(ConfirmRegistration)

            expect(diagram(Register)).to.be.equal('(Register)>(Confirm Registration)')
        })

        it('Meaty Example', () => {
            const NoteFig1 = new Note('figure 1.2{bg:beige}')
            const User = new Actor('User')
            const Login = new Case('Login')
            const SiteMaintainer = new Actor('Site Maintainer')
            const AddUser = new Case('Add User')
            const AddCompany = new Case('Add Company')
            const UploadDocs = new Case('Upload Docs')
            const ManageFolders = new Case('Manage Folders')
            const FullTextSearchDocs = new Case('Full Text Search Docs')
            const PreviewDoc = new Case('Preview Doc')
            const DownloadDocs = new Case('Download Docs')
            const BrowseDocs = new Case('Browse Docs')
            const PostNewEventToTheWebSite = new Case('Post New Event To The Web Site')
            const ViewEvents = new Case('View Events')

            User.use(Login)
            SiteMaintainer.use(AddUser)
            AddUser.extend(AddCompany)
            SiteMaintainer.use(UploadDocs)
            UploadDocs.extend(ManageFolders)
            User.use(UploadDocs)
            User.use(FullTextSearchDocs)
            FullTextSearchDocs.include(PreviewDoc)
            FullTextSearchDocs.include(DownloadDocs)
            User.use(BrowseDocs)
            BrowseDocs.include(PreviewDoc)

            DownloadDocs.point()

            SiteMaintainer.use(PostNewEventToTheWebSite)
            User.use(ViewEvents)

            expect(
                diagram(
                    AddUser,
                    BrowseDocs,
                    DownloadDocs,
                    FullTextSearchDocs,
                    NoteFig1,
                    SiteMaintainer,
                    UploadDocs,
                    User,
                )
            ).to.be.equal('(note: figure 1.2{bg:beige}), [User]-(Login), [Site Maintainer]-(Add User), (Add User)<(Add Company), [Site Maintainer]-(Upload Docs), (Upload Docs)<(Manage Folders), [User]-(Upload Docs), [User]-(Full Text Search Docs), (Full Text Search Docs)>(Preview Doc), (Full Text Search Docs)>(Download Docs), [User]-(Browse Docs), (Browse Docs)>(Preview Doc), (Download Docs), [Site Maintainer]-(Post New Event To The Web Site), [User]-(View Events)')
        })

    })
})
