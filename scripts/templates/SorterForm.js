class SorterForm {
    constructor(media) {
        this.media= media

        this.$wrapper = document.createElement('div')
        this.$sorterFormWrapper = document.querySelector('.sorter-form-wrapper')
        //this.$moviesWrapper = document.querySelector('.movies-wrapper')

        this.ProxyRatingSorter = new ProxyRatingSorter()
    }

    async sorterMedia(sorter) {
        this.clearMediaWrapper()

        if (!!sorter) {
            // Vous pourrez supprimer cette ligne
            // const sortedData = await RatingSorterApi.sorter(this.Movies, sorter)

            const sortedData = await this.ProxyRatingSorter.sorter(this.media, sorter)


            const SortedMedia = sortedData.data 

            SortedMedia.forEach(media => {
                const mediaTemplate = new MediaCard(media)
                this.$mediaWrapper.appendChild(Template.createMediaCard())
            })
        } else {
            this.Movies.forEach(Movie => {
                const mediaTemplate = new MediaCard(media)
                this.$mediaWrapper.appendChild(Template.createMediaCard())
            })
        }
    }

    onChangeSorter() {
        this.$wrapper
            .querySelector('form')
            .addEventListener('change', e => {
                const sorter = e.target.value
                this.sorterMedia(sorter)
            })
    }

    clearMediaWrapper() {
        this.$mediaWrapper.innerHTML = ""
    }

    render() {
        const sorterForm = `
            <form action="#" method="POST" class="sorter-form">
                <label for="sorter-select">Triez par date de sortie : </label>
                <select name="sorter-select" id="sorter-select">
                    <option value="">Aucun tri</option>
                    <option value="ASC">Croissante</option>
                    <option value="DESC">Décroissante</option>
                </select>
            </form>
        `

        this.$wrapper.innerHTML = sorterForm
        this.onChangeSorter()

        this.$sorterFormWrapper.appendChild(this.$wrapper)
    }
}