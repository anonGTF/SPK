<template>
  <div>
    <v-container 
      class="mx-0 my-0 mx-sm-5 my-sm-5"  
      fluid
    >
      <h1>Pengambilan Keputusan dalam <span id="step-1">Resiko</span></h1>
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
          <p class="mt-4">
            pengambilan keputusan yang berkaitan dengan dinamika atau ketidakpastian.<br> Dimana hasil yang diperoleh harus ditanggung sebagai konsekuensi. 
            <a href="https://drive.google.com/file/d/1zxPviPHvD_MsNMhMDLhlV28nuYMiLrT-/view" target="_blank">learn more</a>
          </p>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-card
            v-if="onTour || summary != 0"
            id="step-6"
            width="70%"
            outlined
            flat
          >
            <v-card-title class="pb-0">
              Kesimpulan
            </v-card-title>
            <v-card-text>
              Barang yang harus dijual setiap harinya adalah sebanyak: <strong>{{ summary }}</strong> buah
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <strong id="step-2">Produksi dan Penjualan</strong>
          <v-row class="mt-1">
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-text-field
                v-model="productionCost"
                label="Biaya Produksi"
                outlined
                dense
                type="number"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-text-field
                v-model="sellingCost"
                label="Harga Jual"
                outlined
                dense
                type="number"
              />
            </v-col>
          </v-row>
          <strong id="step-3" >Probabilitas dan permintaan</strong>
          <form 
            class="mt-7"
            @keyup.enter="addField(probabilities)"
          >
            <v-row
              v-for="(item, index) in probabilities"
              :key="`prob-${index}`"
            >
              <v-col
                class="py-0 my-0"
                cols="12"
                sm="6"
                md="3"
              >
                <v-text-field
                  v-model="item.demand"
                  label="Permintaan"
                  outlined
                  dense
                  type="number"
                />
              </v-col>
              <v-col
                class="py-0 my-0"
                cols="12"
                sm="6"
                md="3"
              >
                <v-text-field
                  v-model="item.prob"
                  append-icon="mdi-percent"
                  label="Probabilitas"
                  outlined
                  dense
                  persistent-hint
                  hint="value: 0 - 100"
                  :rules="rules"
                  type="number"
                />
              </v-col>

              <v-btn
                v-if="index != 0"
                icon
                color="#FB2A09"
                @click="removeField(index, probabilities)"
                class="ml-n2"
              >
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-row>
          </form>
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-btn
                id="step-4"
                class="text-none white--text"
                color="#00BF71"
                block
                @click="addField(probabilities)"
              >
                <v-icon class="mr-1 body-1">mdi-plus-circle</v-icon>
                Tambah Probabilitas
              </v-btn>

              <v-btn
                id="step-7"
                class="text-none red--text mt-5"
                color="red"
                outlined
                block
                @click="reset"
              >
                Reset
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col id="step-5">
          <strong>Tabel Payoff</strong>

          <v-simple-table 
            class="my-3"
            dense
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Demand x Probability
                  </th>
                  <th class="text-left"
                    v-for="(item, index) in probabilities"
                    :key="`header-${index}`"
                  >
                    {{ item.demand }} = {{ item.prob }}%
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in payoff"
                  :key="`row-${index}`"
                >
                  <th>{{ item.demand }}</th>
                  <td
                    v-for="(data, index) in item.resultData"
                    :key="`data-${index}`"
                  >
                    {{ data }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <strong>Expected Return</strong>

          <v-simple-table 
            class="my-3"
            dense
          >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Demand
                  </th>
                  <th class="text-left">
                    Calculation
                  </th>
                  <th class="text-left">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in expectedReturn"
                  :key="index"
                >
                  <td>{{ item.demand }}</td>
                  <td>{{ item.calculation }}</td>
                  <td>{{ item.result }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
    <v-footer 
      padless
      fixed
      color="#00BF71"
      class="pa-2 white--text"
    >
      Made with 
      <img 
        src="../assets/heart.svg" 
        alt="heart icon" 
        height="20" 
        width="20" 
        class="mx-1"
      > 
      by <strong class="mx-1"> Galih Tegar Febrianto</strong> (2110191043)
    </v-footer>

    <v-tour 
      name="TutorialTour" 
      :steps="steps" 
      :options="options"
      :callbacks="{ onFinish: finishTour }"
    />
  </div>
</template>

<script>
  export default {
    name: 'Home',

    data () {
      return {
        productionCost: null,
        sellingCost: null,
        probabilities: [
          {
            demand: 0,
            prob: 0
          }
        ],
        rules: [
          v => /^(\d{0,2}(\.\d+)?|100(\.0+)?)$/.test(v) || 'Harus di antara 0 dan 100'
        ],
        onTour: true,
        steps: [
          {
            target: '#step-1',
            header: {
              title: 'Selamat Datang!',
            },
            content: `Kali ini Anda sampai pada website untuk menentukan keputusan dalam resiko`,
            params: {
              highlight: false
            }
          },
          {
            target: '#step-2',
            content: 'Pertama-tama, masukan biaya produksi dan harga jual',
            params: {
              placement: 'top'
            }
          },
          {
            target: '#step-3',
            content: 'Lalu masukan probabilitas dan demand yang ada',
            params: {
              placement: 'top'
            }
          },
          {
            target: '#step-4',
            content: 'Anda bisa menambahkan probabilitas dan demand lagi dengan klik tombol ini atau tekan Enter',
            params: {
              placement: 'right'
            }
          },
          {
            target: '#step-5',
            content: 'Di bagian ini, Anda bisa melihat hasil dari perhitungan yang didapat secara real time',
            params: {
              placement: 'top'
            }
          },
          {
            target: '#step-6',
            content: 'Lalu di sini Anda bisa melihat kesimpulan keputusan mana yang harus diambil',
            params: {
              placement: 'bottom'
            }
          },
          {
            target: '#step-7',
            content: 'Setelah Anda selesai, Anda bisa me-reset dengan menekan tombol ini'
          }
        ],
        options: {
          highlight: true,
          labels: {
            buttonSkip: 'Skip tour',
            buttonPrevious: 'Sebelumnya',
            buttonNext: 'Selanjutnya',
            buttonStop: 'Selesai'
          }
        }
      }
    },

    computed: {
      payoff () {
        return this.probabilities.map((item) => {
          const temp = {
            demand: item.demand,
            prob: item.prob,
            resultData: []
          }
          this.probabilities.forEach((i) => {
            const res = 
              (i.demand < item.demand) 
              ? i.demand * this.sellingCost - item.demand * this.productionCost
              : item.demand * this.sellingCost - item.demand * this.productionCost
            temp.resultData.push(res)
          })
          return temp
        })
      },

      expectedReturn () {
        const payoffData = this.payoff
        return payoffData.map((item) => {
          const temp = {
            demand: item.demand,
            calculation: null,
            result: 0
          }
          item.resultData.forEach((data, index) => {
            const res = data * this.probabilities[index].prob / 100
            temp.calculation = 
              (temp.calculation != null) ? 
              `${temp.calculation} + (${res})` :
              `(${res})`
            temp.result += res
          })

          return temp
        })
      },

      summary () {
        const temp = this.expectedReturn.map((item) => item.result)
        const maxVal = Math.max.apply(Math, temp)
        const res = this.expectedReturn[temp.indexOf(maxVal)]

        return res.demand
      }
    },

    mounted () {
      this.$tours['TutorialTour'].start()
    },

    methods: {
      addField (fieldType) {
        fieldType.push(
          { 
            demand: null,
            prob: null 
          }
        );
      },

      removeField (index, fieldType) {
        fieldType.splice(index, 1);
      },

      reset () {
        this.productionCost = null,
        this.sellingCost = null,
        this.probabilities = [
          {
            demand: 0,
            prob: 0
          }
        ]
      },

      finishTour () {
        this.onTour = false
      }
    }
  }
</script>
<style>
h1 span {
  border-bottom: 5px solid #00BF71;
}
</style>
